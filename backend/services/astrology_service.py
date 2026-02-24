"""
Astrology service: Prokerala API (primary) + PyJHora (fallback).
"""
import httpx
import asyncio
from datetime import datetime
from config import get_settings

settings = get_settings()

PROKERALA_TOKEN_URL = "https://api.prokerala.com/token"
PROKERALA_BASE = "https://api.prokerala.com/v2/astrology"

_prokerala_token: str | None = None
_token_expires_at: float = 0


async def _get_prokerala_token() -> str | None:
    """Get OAuth2 token for Prokerala API."""
    global _prokerala_token, _token_expires_at
    if not settings.prokerala_client_id:
        return None
    import time
    if _prokerala_token and time.time() < _token_expires_at - 30:
        return _prokerala_token
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            PROKERALA_TOKEN_URL,
            data={
                "grant_type": "client_credentials",
                "client_id": settings.prokerala_client_id,
                "client_secret": settings.prokerala_client_secret,
            },
        )
        if resp.status_code == 200:
            data = resp.json()
            _prokerala_token = data["access_token"]
            import time
            _token_expires_at = time.time() + data.get("expires_in", 3600)
            return _prokerala_token
    return None


async def _prokerala_get(endpoint: str, params: dict) -> dict | None:
    token = await _get_prokerala_token()
    if not token:
        return None
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            f"{PROKERALA_BASE}/{endpoint}",
            params=params,
            headers={"Authorization": f"Bearer {token}"},
        )
        if resp.status_code == 200:
            return resp.json()
    return None


def _pyjhora_fallback_kundali(dob: str, tob: str, lat: float, lon: float, tz: float) -> dict:
    """PyJHora fallback for birth chart."""
    try:
        from jhora.horoscope.chart import charts
        from jhora.panchanga import drik
        from jhora import utils
        dt = datetime.strptime(f"{dob} {tob}", "%Y-%m-%d %H:%M")
        jd = utils.julian_day_number(dt.year, dt.month, dt.day, dt.hour + dt.minute/60 + tz)
        place = drik.Place("Custom", lat, lon, tz)
        chart_data = charts.rasi_chart(jd, place)
        return {"source": "pyjhora", "chart": chart_data, "note": "Prokerala unavailable"}
    except Exception as e:
        return {"error": str(e), "source": "pyjhora_failed"}


def _pyjhora_kaal_sarp(dob: str, tob: str, lat: float, lon: float, tz: float) -> dict:
    """Detect Kaal Sarp Dosh using PyJHora."""
    try:
        from jhora.horoscope.chart import charts
        from jhora.panchanga import drik
        from jhora import utils
        from jhora.horoscope.main import Chart
        dt = datetime.strptime(f"{dob} {tob}", "%Y-%m-%d %H:%M")
        jd = utils.julian_day_number(dt.year, dt.month, dt.day, dt.hour + dt.minute/60 + tz)
        place = drik.Place("Custom", lat, lon, tz)
        h = Chart(jd, place)
        ksd = h.kala_sarpa_dosha()
        return {"source": "pyjhora", "kaal_sarp": ksd}
    except Exception as e:
        return _manual_kaal_sarp_fallback(dob, tob, lat, lon, tz)


def _manual_kaal_sarp_fallback(dob: str, tob: str, lat: float, lon: float, tz: float) -> dict:
    """
    Manual Kaal Sarp Dosh detection using pyswisseph.
    Rule: All 7 planets (Sun-Saturn) must fall on one side of the Rahu-Ketu axis.
    """
    try:
        import swisseph as swe
        from jhora import utils
        dt = datetime.strptime(f"{dob} {tob}", "%Y-%m-%d %H:%M")
        jd = utils.julian_day_number(dt.year, dt.month, dt.day, dt.hour + dt.minute/60 + tz)

        planets = {
            "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS,
            "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER,
            "Venus": swe.VENUS, "Saturn": swe.SATURN,
        }
        rahu_deg = swe.calc_ut(jd, swe.MEAN_NODE)[0][0]
        ketu_deg = (rahu_deg + 180) % 360

        planet_degrees = {}
        for name, pid in planets.items():
            deg = swe.calc_ut(jd, pid)[0][0]
            planet_degrees[name] = deg

        # Check if all planets are on one side of the Rahu-Ketu axis
        def is_between(a, b, x):
            if b > a:
                return a <= x <= b
            return x >= a or x <= b

        count_rahu_ketu_side = sum(
            1 for d in planet_degrees.values()
            if is_between(ketu_deg, rahu_deg, d)
        )
        has_ksd = (count_rahu_ketu_side == 7 or count_rahu_ketu_side == 0)

        # Determine type by Rahu house (approximate)
        ksd_types = [
            "Anant", "Kulik", "Vasuki", "Shankhpal", "Padam", "Mahapadam",
            "Takshak", "Karkotak", "Shankhachud", "Ghatak", "Vishdhar", "Sheshnag"
        ]
        rahu_house = int(rahu_deg / 30) % 12
        ksd_type = ksd_types[rahu_house] if has_ksd else None

        remedies = []
        if has_ksd:
            remedies = [
                "Perform Kaal Sarp Puja at Trimbakeshwar or Nasik",
                "Recite Maha Mrityunjaya Mantra 108 times daily",
                "Worship Lord Shiva with Rudrabhishek",
                "Wear Gomed (Hessonite) or Cat's Eye gemstone after consultation",
                "Donate black sesame seeds and black cloth on Saturdays",
            ]

        return {
            "source": "manual_calculation",
            "has_kaal_sarp_dosh": has_ksd,
            "type": ksd_type,
            "rahu_degree": round(rahu_deg, 2),
            "ketu_degree": round(ketu_deg, 2),
            "planet_degrees": {k: round(v, 2) for k, v in planet_degrees.items()},
            "remedies": remedies,
        }
    except Exception as e:
        return {"error": str(e), "has_kaal_sarp_dosh": None}


# ── Public API functions ──────────────────────────────────────────────────────

async def get_kundali(dob: str, tob: str, lat: float, lon: float, tz: float, ayanamsa: str = "lahiri") -> dict:
    params = {
        "datetime": f"{dob}T{tob}:00+{int(tz):02d}:00",
        "coordinates": f"{lat},{lon}",
        "ayanamsa": ayanamsa,
        "chart_type": "north-indian",
        "chart_style": "north-indian",
        "format": "svg",
        "la": "en",
    }
    result = await _prokerala_get("kundli", params)
    if result:
        result["source"] = "prokerala"
        return result
    return _pyjhora_fallback_kundali(dob, tob, lat, lon, tz)


async def get_kundali_matching(
    person1: dict, person2: dict, lat1: float, lon1: float, tz1: float,
    lat2: float, lon2: float, tz2: float,
) -> dict:
    params = {
        "girl_dob": person1["dob"],
        "girl_tob": person1["tob"],
        "girl_coordinates": f"{lat1},{lon1}",
        "boy_dob": person2["dob"],
        "boy_tob": person2["tob"],
        "boy_coordinates": f"{lat2},{lon2}",
        "ayanamsa": "lahiri",
        "la": "en",
    }
    result = await _prokerala_get("kundli-matching", params)
    if result:
        result["source"] = "prokerala"
        return result
    return {"error": "Prokerala unavailable and PyJHora matching not implemented", "source": "none"}


async def get_kaal_sarp_dosh(dob: str, tob: str, lat: float, lon: float, tz: float) -> dict:
    params = {
        "datetime": f"{dob}T{tob}:00+{int(tz):02d}:00",
        "coordinates": f"{lat},{lon}",
        "ayanamsa": "lahiri",
        "la": "en",
    }
    result = await _prokerala_get("kalsarp-dosha", params)
    if result:
        result["source"] = "prokerala"
        return result
    return _pyjhora_kaal_sarp(dob, tob, lat, lon, tz)


async def get_sade_sati(dob: str, tob: str, lat: float, lon: float, tz: float) -> dict:
    params = {
        "datetime": f"{dob}T{tob}:00+{int(tz):02d}:00",
        "coordinates": f"{lat},{lon}",
        "ayanamsa": "lahiri",
        "la": "en",
    }
    result = await _prokerala_get("sade-sati", params)
    if result:
        result["source"] = "prokerala"
        return result
    return {"error": "Prokerala unavailable", "source": "none"}


async def get_mangal_dosh(dob: str, tob: str, lat: float, lon: float, tz: float) -> dict:
    params = {
        "datetime": f"{dob}T{tob}:00+{int(tz):02d}:00",
        "coordinates": f"{lat},{lon}",
        "ayanamsa": "lahiri",
        "la": "en",
    }
    result = await _prokerala_get("mangal-dosha", params)
    if result:
        result["source"] = "prokerala"
        return result
    return {"error": "Prokerala unavailable", "source": "none"}
