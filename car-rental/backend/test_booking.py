import requests

def test():
    # Login
    res = requests.post("http://localhost:8000/api/auth/login", json={
        "email": "user1@carrental.com",
        "password": "user123"
    })
    if res.status_code != 200:
        print("Login failed:", res.text)
        return
    token = res.json()["accessToken"]

    # Get a vehicle
    res = requests.get("http://localhost:8000/api/vehicles")
    vehicles = res.json().get("items", [])
    if not vehicles:
        print("No vehicles found")
        return
    vehicle_id = vehicles[0]["_id"]

    # Create booking
    import datetime
    start = datetime.datetime.now() + datetime.timedelta(days=1)
    end = start + datetime.timedelta(days=2)
    
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "idempotencyKey": f"test_{datetime.datetime.now().timestamp()}",
        "vehicleId": vehicle_id,
        "startDate": start.isoformat() + "Z",
        "endDate": end.isoformat() + "Z",
        "paymentMethod": "mock_card",
        "pickupLocation": "Test Location"
    }
    
    res = requests.post("http://localhost:8000/api/bookings", json=payload, headers=headers)
    print("Booking Status:", res.status_code)
    print("Booking Response:", res.text)

if __name__ == "__main__":
    test()
