import asyncio
from app.database import bookings_col

async def main():
    cursor = bookings_col.find({}).sort("createdAt", -1).limit(5)
    with open("out.txt", "w") as f:
        async for b in cursor:
            f.write(f"ID: {b['_id']}\n")
            f.write(f"CreatedAt: {b.get('createdAt')}\n")
            f.write(f"VehicleID (type): {type(b.get('vehicleId'))} - {b.get('vehicleId')}\n")
            f.write(f"UserID (type): {type(b.get('userId'))} - {b.get('userId')}\n")
            f.write(f"OwnerID (type): {type(b.get('ownerId'))} - {b.get('ownerId')}\n")
            f.write(f"Status: {b.get('status')}\n")
            f.write("---\n")

if __name__ == "__main__":
    asyncio.run(main())
