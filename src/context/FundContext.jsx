import { createContext, useContext, useReducer, useEffect } from 'react';

const FundContext = createContext();

const STORAGE_KEY = 'fundforge_state';

const defaultFundData = {
  // Stage 1: Fund Ideation
  ideation: {
    fundStrategy: '',
    targetSize: '',
    investmentThesis: '',
    fundTerm: 10,
    investmentPeriod: 5,
    managementFee: 2.0,
    carryRate: 20,
    hurdleRate: 8,
    catchUp: true,
    gpCommitment: 2,
    fundSize: 100000000,
    expectedGrossReturns: 15,
    businessCaseSummary: '',
  },

  // Stage 2: Fund Setup
  setup: {
    // Fund structure
    fundName: '',
    legalEntityType: 'Limited Partnership',
    domicile: 'Australia',
    fundType: 'VC',

    // Key parties
    gpName: '',
    gpDetails: '',
    trustee: '',
    investmentManager: '',
    fundAdministrator: '',

    // Economic terms
    mgmtFeeStructure: 'Committed Capital',
    carryPerformanceFee: 20,
    hurdleRate: 8,
    catchUp: true,
    gpCommit: 2,
    preferredReturn: 8,

    // Fund terms
    fundSizeMin: '',
    fundSizeMax: '',
    firstCloseDate: '',
    finalCloseDate: '',
    fundTerm: 10,
    investmentPeriod: 5,
    extensionOptions: '2 x 1-year extensions',

    // Investment strategy
    assetClass: 'Venture Capital',
    geography: 'Australia & New Zealand',
    stageSectorFocus: '',
    investmentSizeMin: '',
    investmentSizeMax: '',
    diversificationLimits: '15% of commitments per investment',

    // Governance
    advisoryBoardComposition: '3 LP representatives',
    lpConsentRights: '',
    keyPersonProvisions: '',
    removalRights: '',

    // Fees & expenses
    mgmtFeeCalcBasis: 'Committed Capital during investment period, then invested capital',
    organizationalExpenses: '',
    fundExpensesCap: '',

    // Distributions
    distributionPolicy: 'Deal-by-deal with clawback',
    distributionTiming: 'Within 30 days of realization',
    reinvestmentRights: 'Recycling of invested capital up to 120% of commitments',

    // Transfer restrictions
    lpTransferRights: 'Subject to GP consent',
    rofrTagAlong: 'ROFR in favor of existing LPs',
    assignmentConditions: '',

    // Reporting
    reportingFrequency: 'Quarterly',
    contentRequirements: 'NAV, portfolio summary, financial statements',
    auditRequirements: 'Annual audit by Big 4 firm',

    // Tax/regulatory
    taxStructure: 'Flow-through (tax transparent)',
    regulatoryRegistrations: 'AFSL, ASIC registration',
    complianceRequirements: '',
  },

  // Stage 3: Fundraising
  fundraising: {
    targetInvestors: '',
    minimumCommitment: 1000000,
    investors: [],
  },

  // Stage 4: Launch
  launch: {
    bankAccountsOpened: false,
    systemsAccessGranted: false,
    complianceRegistered: false,
    serviceProvidersEngaged: false,
    goLiveChecklist: [],
  },

  // Stage 5: Operations
  operations: {
    documents: [],
    complianceCalendar: [],
  },

  // Document tracking
  documents: {
    generated: {},
    reviewed: {},
    comments: {},
  },

  // Project Management
  projectManagement: {
    tasks: null, // null = use defaults
    team: null,  // null = use defaults
  },
};

const initialState = {
  currentStage: 0,
  fundData: defaultFundData,
  stageCompletion: [false, false, false, false, false],
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        fundData: {
          ...defaultFundData,
          ...parsed.fundData,
          ideation: { ...defaultFundData.ideation, ...parsed.fundData?.ideation },
          setup: { ...defaultFundData.setup, ...parsed.fundData?.setup },
          fundraising: { ...defaultFundData.fundraising, ...parsed.fundData?.fundraising },
          launch: { ...defaultFundData.launch, ...parsed.fundData?.launch },
          operations: { ...defaultFundData.operations, ...parsed.fundData?.operations },
          documents: { ...defaultFundData.documents, ...parsed.fundData?.documents },
          projectManagement: { ...defaultFundData.projectManagement, ...parsed.fundData?.projectManagement },
        },
      };
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return initialState;
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STAGE':
      return { ...state, currentStage: action.payload };

    case 'UPDATE_IDEATION':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          ideation: { ...state.fundData.ideation, ...action.payload },
        },
      };

    case 'UPDATE_SETUP':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          setup: { ...state.fundData.setup, ...action.payload },
        },
      };

    case 'UPDATE_FUNDRAISING':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          fundraising: { ...state.fundData.fundraising, ...action.payload },
        },
      };

    case 'UPDATE_LAUNCH':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          launch: { ...state.fundData.launch, ...action.payload },
        },
      };

    case 'UPDATE_OPERATIONS':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          operations: { ...state.fundData.operations, ...action.payload },
        },
      };

    case 'UPDATE_DOCUMENTS':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          documents: { ...state.fundData.documents, ...action.payload },
        },
      };

    case 'MARK_DOCUMENT_REVIEWED':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          documents: {
            ...state.fundData.documents,
            reviewed: {
              ...state.fundData.documents.reviewed,
              [action.payload.docId]: action.payload.reviewed,
            },
          },
        },
      };

    case 'SET_DOCUMENT_COMMENT':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          documents: {
            ...state.fundData.documents,
            comments: {
              ...state.fundData.documents.comments,
              [action.payload.docId]: action.payload.comment,
            },
          },
        },
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          projectManagement: { ...state.fundData.projectManagement, ...action.payload },
        },
      };

    case 'MARK_STAGE_COMPLETE':
      const newCompletion = [...state.stageCompletion];
      newCompletion[action.payload] = true;
      return { ...state, stageCompletion: newCompletion };

    case 'ADD_INVESTOR':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          fundraising: {
            ...state.fundData.fundraising,
            investors: [...state.fundData.fundraising.investors, action.payload],
          },
        },
      };

    case 'UPDATE_INVESTOR':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          fundraising: {
            ...state.fundData.fundraising,
            investors: state.fundData.fundraising.investors.map((inv) =>
              inv.id === action.payload.id ? { ...inv, ...action.payload } : inv
            ),
          },
        },
      };

    case 'DELETE_INVESTOR':
      return {
        ...state,
        fundData: {
          ...state.fundData,
          fundraising: {
            ...state.fundData.fundraising,
            investors: state.fundData.fundraising.investors.filter(
              (inv) => inv.id !== action.payload
            ),
          },
        },
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

export function FundProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <FundContext.Provider value={{ state, dispatch }}>
      {children}
    </FundContext.Provider>
  );
}

export function useFund() {
  const context = useContext(FundContext);
  if (!context) throw new Error('useFund must be used within FundProvider');
  return context;
}
