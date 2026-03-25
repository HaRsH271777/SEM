import asyncio
from app.database import bookings_col
import pprint

async def main():
    cursor = bookings_col.find({}).sort("createdAt", -1).limit(3)
    async for b in cursor:
        print("Booking ID:", b["_id"])
        print("CreatedAt:", b.get("createdAt"))
        print("VehicleID:", repr(b.get("vehicleId")))
        print("OwnerID:", repr(b.get("ownerId")))
        print("UserID:", repr(b.get("userId")))
        print("---")

if __name__ == "__main__":
    asyncio.run(main())
