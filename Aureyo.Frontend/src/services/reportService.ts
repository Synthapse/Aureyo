import axios from 'axios';
import { MarketingStrategyReport, EarlyAdaptersDesignReport, GoToMarketReport, RedditAudienceReport } from '../types/reports';
import config from '../config.json'

const API_BASE_URL = config.apps.RaportingAPI.url;
const MAS_BASE_URL = config.apps.MASAPI.url;

export const generateMarketingStrategyReport = async (data: MarketingStrategyReport) => {
  const response = await axios.post(`${API_BASE_URL}/marketing-strategy`, data);
  return response.data;
};

export const generateEarlyAdaptersReport = async (data: EarlyAdaptersDesignReport) => {
  const response = await axios.post(`${API_BASE_URL}/early-adopter-strategy`, data);
  return response.data;
};

export const generateGoToMarketReport = async (data: GoToMarketReport) => {
  const response = await axios.post(`${API_BASE_URL}/go-to-market`, data);
  return response.data;
};

export const generateRedditAudienceReport = async (data: RedditAudienceReport) => {
  const response = await axios.post(`${MAS_BASE_URL}/analysis/community`, data);
  return response.data;
}; 