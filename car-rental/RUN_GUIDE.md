# Running the Project

**Starting Directory:** `c:\VSCode\SEM\SEM-main\SEM-main\car-rental`

To start the project, open two separate terminal windows in the directory above and follow these steps.

### 1. Start the Backend
```bash
cd backend
# Activate virtual environment
.\.venv311\Scripts\activate
# Start FastAPI (using python -m for reliability)
python -m uvicorn main:app --reload --port 8000
```
- API Docs: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

### 2. Start the Frontend
```bash
cd frontend
# Start Vite development server
npm run dev
```
- Web App: [http://localhost:5173](http://localhost:5173)

---

### First Run Only (Setup)
If you haven't installed dependencies yet:
- **Backend**: `pip install -r backend/requirements.txt`
- **Frontend**: `npm install`
- **Database**: `python backend/seed.py` (to generate initial data)

#### Default Credentials (after running seed.py)
- **Admin**: `admin@carrental.com` / `admin123`
- **Owner**: `owner1@carrental.com` / `owner123` (up to `owner8`)
- **User**: `user1@carrental.com` / `user123` (up to `user15`)
