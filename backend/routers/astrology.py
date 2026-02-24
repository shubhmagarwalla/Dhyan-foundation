from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.astrology_service import (
    get_kundali, get_kundali_matching, get_kaal_sarp_dosh,
    get_sade_sati, get_mangal_dosh,
)

router = APIRouter(prefix="/astrology", tags=["astrology"])


class BirthDetails(BaseModel):
    dob: str       # YYYY-MM-DD
    tob: str       # HH:MM
    lat: float
    lon: float
    tz: float = 5.5  # IST default


class MatchingRequest(BaseModel):
    person1: BirthDetails
    person2: BirthDetails


@router.post("/kundali")
async def kundali(req: BirthDetails):
    result = await get_kundali(req.dob, req.tob, req.lat, req.lon, req.tz)
    return result


@router.post("/matching")
async def kundali_matching(req: MatchingRequest):
    result = await get_kundali_matching(
        req.person1.model_dump(), req.person2.model_dump(),
        req.person1.lat, req.person1.lon, req.person1.tz,
        req.person2.lat, req.person2.lon, req.person2.tz,
    )
    return result


@router.post("/kaal-sarp-dosh")
async def kaal_sarp_dosh(req: BirthDetails):
    result = await get_kaal_sarp_dosh(req.dob, req.tob, req.lat, req.lon, req.tz)
    return result


@router.post("/sade-sati")
async def sade_sati(req: BirthDetails):
    result = await get_sade_sati(req.dob, req.tob, req.lat, req.lon, req.tz)
    return result


@router.post("/mangal-dosh")
async def mangal_dosh(req: BirthDetails):
    result = await get_mangal_dosh(req.dob, req.tob, req.lat, req.lon, req.tz)
    return result
