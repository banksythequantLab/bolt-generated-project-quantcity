from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import pandas as pd
from typing import List, Optional
from pydantic import BaseModel
import logging
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = "postgresql://user:password@db/secdb"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Filing(Base):
    __tablename__ = "filings"
    
    id = Column(Integer, primary_key=True)
    company_name = Column(String)
    ticker = Column(String)
    filing_type = Column(String)
    filing_date = Column(DateTime)
    filing_url = Column(String)
    content = Column(Text)
    sentiment_score = Column(Float)

Base.metadata.create_all(bind=engine)

class FilingResponse(BaseModel):
    id: int
    company_name: str
    ticker: str
    filing_type: str
    filing_date: datetime
    sentiment_score: Optional[float]

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def fetch_filings(days_back: int = 7):
    """Fetch recent SEC filings"""
    try:
        async with httpx.AsyncClient() as client:
            # Example URL - replace with actual SEC API endpoint
            url = f"https://www.sec.gov/cgi-bin/browse-edgar"
            params = {
                "action": "getcurrent",
                "datea": (datetime.now() - timedelta(days=days_back)).strftime("%Y%m%d"),
                "owner": "include",
                "type": "10-k,10-q,8-k"
            }
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            # Parse the response
            soup = BeautifulSoup(response.text, 'html.parser')
            filings = []
            
            # Extract filing information (customize based on actual HTML structure)
            for filing in soup.find_all('filing'):
                filing_data = {
                    'company_name': filing.find('company').text,
                    'ticker': filing.find('ticker').text,
                    'filing_type': filing.find('type').text,
                    'filing_date': datetime.strptime(filing.find('date').text, '%Y-%m-%d'),
                    'filing_url': filing.find('url').text
                }
                filings.append(filing_data)
            
            return filings
            
    except Exception as e:
        logger.error(f"Error fetching filings: {str(e)}")
        return []

@app.get("/api/filings", response_model=List[FilingResponse])
async def get_filings():
    """Get all filings from database"""
    db = SessionLocal()
    try:
        filings = db.query(Filing).order_by(Filing.filing_date.desc()).all()
        return filings
    finally:
        db.close()

@app.get("/api/filings/refresh")
async def refresh_filings():
    """Refresh filings data"""
    try:
        filings = await fetch_filings()
        db = SessionLocal()
        
        for filing_data in filings:
            filing = Filing(**filing_data)
            db.add(filing)
        
        db.commit()
        return {"message": f"Successfully refreshed {len(filings)} filings"}
    
    except Exception as e:
        logger.error(f"Error refreshing filings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
