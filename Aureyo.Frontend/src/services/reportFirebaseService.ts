import { collection, getDocs, query, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { MarketingStrategyReport, EarlyAdaptersDesignReport, GoToMarketReport, ReportType } from '../types/reports';

export interface Report {
  id: string;
  type: ReportType;
  inputData: any;
  data: MarketingStrategyReport | EarlyAdaptersDesignReport | GoToMarketReport;
  createdAt: Date;
  status: 'completed' | 'pending' | 'failed';
}

export const getReports = async (): Promise<Report[]> => {
  const reportsRef = collection(db, 'reports');
  const q = query(reportsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs
    .map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.tab,
        inputData: data.inputData,
        data: data.reportText,
        createdAt: (data.createdAt as Timestamp).toDate(),
        status: data.status,
        public: data.public, // Assuming the field is called `public`
      };
    })
    .filter(report => report.public); // Only return reports where public is true
};

export const getReportById = async (id: string): Promise<Report | null> => {
  try {
    const reportRef = doc(db, 'reports', id);
    const reportDoc = await getDoc(reportRef);
    
    if (!reportDoc.exists()) {
      return null;
    }

    const data = reportDoc.data();
    return {
      id: reportDoc.id,
      type: data.tab,
      data: data.reportText,
      inputData: data.inputData,
      createdAt: (data.createdAt as Timestamp).toDate(),
      status: data.status,
    };
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    return null;
  }
}; 