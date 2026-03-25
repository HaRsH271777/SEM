import asyncio
from app.database import bookings_col, vehicles_col
import pprint

async def test_db():
    print("Testing db connection and counts...")
    print("Bookings count:", await bookings_col.count_documents({}))
    print("Vehicles count:", await vehicles_col.count_documents({}))
    print("Fetching one booking:")
    b = await bookings_col.find_one({})
    if b:
        print(b)
    else:
        print("No bookings found!")

if __name__ == "__main__":
    asyncio.run(test_db())
