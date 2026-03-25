import asyncio
from datetime import datetime, timezone, timedelta
from app.database import bookings_col
from bson import ObjectId

async def fix_dates():
    now = datetime.now(timezone.utc).replace(tzinfo=None) # make offset naive
    cursor = bookings_col.find({"createdAt": {"$gt": now}})
    count = 0
    async for b in cursor:
        diff_days = (b["createdAt"] - now).days + 1
        new_created = now - timedelta(days=diff_days)
        await bookings_col.update_one({"_id": b["_id"]}, {"$set": {"createdAt": new_created}})
        count += 1
    print(f"Fixed {count} future bookings")

if __name__ == "__main__":
    asyncio.run(fix_dates())
