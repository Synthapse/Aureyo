import axios from 'axios';
import { MarketingStrategyReport, EarlyAdaptersDesignReport, GoToMarketReport } from '../types/reports';

const API_BASE_URL = 'https://raporting-319936913236.europe-central2.run.app';

export const generateMarketingStrategyReport = async (data: MarketingStrategyReport) => {
  const response = await axios.post(`${API_BASE_URL}/marketing-strategy`, data);
  return response.data;
};

export const generateEarlyAdaptersReport = async (data: EarlyAdaptersDesignReport) => {
  const response = await axios.post(`${API_BASE_URL}/early-adapters`, data);
  return response.data;
};

export const generateGoToMarketReport = async (data: GoToMarketReport) => {
  const response = await axios.post(`${API_BASE_URL}/go-to-market`, data);
  return response.data;
}; 