import { createContext, useContext, useReducer, useEffect } from 'react';

const FundContext = createContext();

const STORAGE_KEY = 'fundforge_state';

const defaultFirmData = {
  firmName: '',
  firmABN: '',
  afslNumber: '',
  afslHolder: '',
  complianceOfficer: '',
  registeredAddress: '',
  privacyOfficer: '',
  branding: {
    primaryColor: '#1e40af',
    logoText: 'FF',
    platformName: 'FundForge',
    tagline: 'Investment Fund Platform',
  },
};

const defaultIdeation = {
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
};

const defaultSetup = {
  fundName: '',
  legalEntityType: 'Unit Trust',
  domicile: 'Australia',
  fundType: 'VC',
  gpName: '',
  gpDetails: '',
  trustee: '',
  investmentManager: '',
  fundAdministrator: '',
  mgmtFeeStructure: 'Committed Capital',
  carryPerformanceFee: 20,
  hurdleRate: 8,
  catchUp: true,
  gpCommit: 2,
  preferredReturn: 8,
  fundSizeMin: '',
  fundSizeMax: '',
  firstCloseDate: '',
  finalCloseDate: '',
  fundTerm: 10,
  investmentPeriod: 5,
  extensionOptions: '2 x 1-year extensions',
  assetClass: 'Venture Capital',
  geography: 'Australia & New Zealand',
  stageSectorFocus: '',
  investmentSizeMin: '',
  investmentSizeMax: '',
  diversificationLimits: '15% of commitments per investment',
  advisoryBoardComposition: '3 investor representatives',
  lpConsentRights: '',
  keyPersonProvisions: '',
  removalRights: '',
  mgmtFeeCalcBasis: 'Committed Capital during investment period, then invested capital',
  organizationalExpenses: '',
  fundExpensesCap: '',
  distributionPolicy: 'Deal-by-deal with clawback',
  distributionTiming: 'Within 30 days of realisation',
  reinvestmentRights: 'Recycling of invested capital up to 120% of commitments',
  lpTransferRights: 'Subject to Fund Manager consent',
  rofrTagAlong: 'ROFR in favour of existing investors',
  assignmentConditions: '',
  reportingFrequency: 'Quarterly',
  contentRequirements: 'NAV, portfolio summary, financial statements',
  auditRequirements: 'Annual audit by Big 4 firm',
  taxStructure: 'Flow-through (tax transparent)',
  regulatoryRegistrations: 'AFSL, ASIC registration',
  complianceRequirements: '',
  amitElection: true,
  gstRegistered: true,
};

const defaultFundRecord = {
  id: '',
  fundType: 'standard', // 'standard' | 'single_manager_fof' | 'multi_manager_fof'
  status: 'setup',
  createdAt: '',
  stageCompletion: [false, false, false, false, false],
  managers: [],
  ideation: { ...defaultIdeation },
  setup: { ...defaultSetup },
  fundraising: {
    targetInvestors: '',
    minimumCommitment: 1000000,
    investors: [],
  },
  launch: {
    bankAccountsOpened: false,
    systemsAccessGranted: false,
    complianceRegistered: false,
    serviceProvidersEngaged: false,
    goLiveChecklist: [],
  },
  operations: {
    documents: [],
    complianceCalendar: [],
  },
  documents: {
    generated: {},
    reviewed: {},
    comments: {},
  },
  projectManagement: {
    tasks: null,
    team: null,
  },
};

const initialState = {
  currentView: 'firm_dashboard',
  firm: { ...defaultFirmData },
  funds: [],
  activeFundId: null,
};

// Map old numeric stages to new string views
const STAGE_MAP = {
  0: 'fund_dashboard',
  1: 'fund_ideation',
  2: 'fund_setup',
  3: 'documents',
  4: 'fundraising',
  5: 'launch_prep',
  6: 'operations',
  7: 'project_plan',
};

function migrateOldState(parsed) {
  // Detect old single-fund format
  if (parsed.fundData && !parsed.funds) {
    const fundId = 'migrated_' + Date.now();
    const fund = {
      ...defaultFundRecord,
      id: fundId,
      fundType: 'standard',
      status: 'setup',
      createdAt: new Date().toISOString(),
      stageCompletion: parsed.stageCompletion || [false, false, false, false, false],
      ideation: { ...defaultIdeation, ...parsed.fundData?.ideation },
      setup: { ...defaultSetup, ...parsed.fundData?.setup },
      fundraising: { ...defaultFundRecord.fundraising, ...parsed.fundData?.fundraising },
      launch: { ...defaultFundRecord.launch, ...parsed.fundData?.launch },
      operations: { ...defaultFundRecord.operations, ...parsed.fundData?.operations },
      documents: { ...defaultFundRecord.documents, ...parsed.fundData?.documents },
      projectManagement: { ...defaultFundRecord.projectManagement, ...parsed.fundData?.projectManagement },
    };
    // Use fund name if available
    if (fund.setup.fundName) {
      fund.status = 'setup';
    }
    return {
      currentView: 'firm_dashboard',
      firm: { ...defaultFirmData },
      funds: [fund],
      activeFundId: fundId,
    };
  }
  return null;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      // Check for old format and migrate
      const migrated = migrateOldState(parsed);
      if (migrated) return migrated;

      // New format - merge with defaults
      return {
        ...initialState,
        ...parsed,
        firm: { ...defaultFirmData, ...parsed.firm, branding: { ...defaultFirmData.branding, ...parsed.firm?.branding } },
        funds: (parsed.funds || []).map(f => ({
          ...defaultFundRecord,
          ...f,
          ideation: { ...defaultIdeation, ...f.ideation },
          setup: { ...defaultSetup, ...f.setup },
          fundraising: { ...defaultFundRecord.fundraising, ...f.fundraising },
          launch: { ...defaultFundRecord.launch, ...f.launch },
          operations: { ...defaultFundRecord.operations, ...f.operations },
          documents: { ...defaultFundRecord.documents, ...f.documents },
          projectManagement: { ...defaultFundRecord.projectManagement, ...f.projectManagement },
        })),
      };
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return initialState;
}

// Helper: update a field in the active fund
function updateActiveFund(state, updater) {
  return {
    ...state,
    funds: state.funds.map(f =>
      f.id === state.activeFundId ? updater(f) : f
    ),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    // Legacy support
    case 'SET_STAGE': {
      const view = typeof action.payload === 'number'
        ? STAGE_MAP[action.payload] || 'firm_dashboard'
        : action.payload;
      return { ...state, currentView: view };
    }

    // ---- Firm actions ----
    case 'UPDATE_FIRM':
      return { ...state, firm: { ...state.firm, ...action.payload } };

    case 'UPDATE_BRANDING':
      return { ...state, firm: { ...state.firm, branding: { ...state.firm.branding, ...action.payload } } };

    // ---- Fund CRUD ----
    case 'CREATE_FUND': {
      const newFund = {
        ...defaultFundRecord,
        ...action.payload,
        id: action.payload.id || 'fund_' + Date.now(),
        createdAt: new Date().toISOString(),
        ideation: { ...defaultIdeation, ...action.payload.ideation },
        setup: { ...defaultSetup, fundName: action.payload.fundName || '', ...action.payload.setup },
      };
      return {
        ...state,
        funds: [...state.funds, newFund],
        activeFundId: newFund.id,
        currentView: 'fund_dashboard',
      };
    }

    case 'DELETE_FUND': {
      const remaining = state.funds.filter(f => f.id !== action.payload);
      return {
        ...state,
        funds: remaining,
        activeFundId: state.activeFundId === action.payload
          ? (remaining.length > 0 ? remaining[0].id : null)
          : state.activeFundId,
        currentView: remaining.length === 0 ? 'firm_dashboard' : state.currentView,
      };
    }

    case 'SET_ACTIVE_FUND':
      return { ...state, activeFundId: action.payload, currentView: 'fund_dashboard' };

    // ---- Fund data actions (scoped to active fund) ----
    case 'UPDATE_IDEATION':
      return updateActiveFund(state, f => ({ ...f, ideation: { ...f.ideation, ...action.payload } }));

    case 'UPDATE_SETUP':
      return updateActiveFund(state, f => ({ ...f, setup: { ...f.setup, ...action.payload } }));

    case 'UPDATE_FUNDRAISING':
      return updateActiveFund(state, f => ({ ...f, fundraising: { ...f.fundraising, ...action.payload } }));

    case 'UPDATE_LAUNCH':
      return updateActiveFund(state, f => ({ ...f, launch: { ...f.launch, ...action.payload } }));

    case 'UPDATE_OPERATIONS':
      return updateActiveFund(state, f => ({ ...f, operations: { ...f.operations, ...action.payload } }));

    case 'UPDATE_DOCUMENTS':
      return updateActiveFund(state, f => ({ ...f, documents: { ...f.documents, ...action.payload } }));

    case 'MARK_DOCUMENT_REVIEWED':
      return updateActiveFund(state, f => ({
        ...f,
        documents: {
          ...f.documents,
          reviewed: { ...f.documents.reviewed, [action.payload.docId]: action.payload.reviewed },
        },
      }));

    case 'SET_DOCUMENT_COMMENT':
      return updateActiveFund(state, f => ({
        ...f,
        documents: {
          ...f.documents,
          comments: { ...f.documents.comments, [action.payload.docId]: action.payload.comment },
        },
      }));

    case 'UPDATE_PROJECT':
      return updateActiveFund(state, f => ({ ...f, projectManagement: { ...f.projectManagement, ...action.payload } }));

    case 'MARK_STAGE_COMPLETE':
      return updateActiveFund(state, f => {
        const newCompletion = [...f.stageCompletion];
        newCompletion[action.payload] = true;
        return { ...f, stageCompletion: newCompletion };
      });

    case 'ADD_INVESTOR':
      return updateActiveFund(state, f => ({
        ...f,
        fundraising: { ...f.fundraising, investors: [...f.fundraising.investors, action.payload] },
      }));

    case 'UPDATE_INVESTOR':
      return updateActiveFund(state, f => ({
        ...f,
        fundraising: {
          ...f.fundraising,
          investors: f.fundraising.investors.map(inv =>
            inv.id === action.payload.id ? { ...inv, ...action.payload } : inv
          ),
        },
      }));

    case 'DELETE_INVESTOR':
      return updateActiveFund(state, f => ({
        ...f,
        fundraising: { ...f.fundraising, investors: f.fundraising.investors.filter(inv => inv.id !== action.payload) },
      }));

    // ---- Manager actions (FoF) ----
    case 'ADD_MANAGER':
      return updateActiveFund(state, f => ({ ...f, managers: [...f.managers, action.payload] }));

    case 'UPDATE_MANAGER':
      return updateActiveFund(state, f => ({
        ...f,
        managers: f.managers.map(m => m.id === action.payload.id ? { ...m, ...action.payload } : m),
      }));

    case 'DELETE_MANAGER':
      return updateActiveFund(state, f => ({
        ...f,
        managers: f.managers.filter(m => m.id !== action.payload),
      }));

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

  const { state, dispatch } = context;
  const activeFund = state.funds.find(f => f.id === state.activeFundId) || null;

  // Provide backward-compatible fundData from active fund
  const defaultFundData = {
    ideation: { ...defaultIdeation },
    setup: { ...defaultSetup },
    fundraising: { targetInvestors: '', minimumCommitment: 1000000, investors: [] },
    launch: { goLiveChecklist: [] },
    operations: { documents: [], complianceCalendar: [] },
    documents: { generated: {}, reviewed: {}, comments: {} },
    projectManagement: { tasks: null, team: null },
  };

  return {
    state: {
      currentView: state.currentView,
      currentStage: state.currentView, // alias
      firm: state.firm,
      funds: state.funds,
      activeFundId: state.activeFundId,
      fundData: activeFund ? {
        ideation: activeFund.ideation,
        setup: activeFund.setup,
        fundraising: activeFund.fundraising,
        launch: activeFund.launch,
        operations: activeFund.operations,
        documents: activeFund.documents,
        projectManagement: activeFund.projectManagement,
      } : defaultFundData,
      stageCompletion: activeFund?.stageCompletion || [false, false, false, false, false],
    },
    dispatch,
    activeFund,
  };
}

export const FUND_TYPES = {
  standard: { label: 'Standard Fund', description: 'Direct investment fund (VC, PE, Real Estate, Credit, Infrastructure)' },
  single_manager_fof: { label: 'Single Manager Fund of Funds', description: 'Fund investing through one underlying manager' },
  multi_manager_fof: { label: 'Multi-Manager Fund of Funds', description: 'Fund investing across multiple underlying managers' },
};
