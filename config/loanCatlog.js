export const loanTypes = [
  {
    id: "personal-loan",
    name: "Personal Loan",
    icon: "account-cash",
    description: "Quick cash for personal needs",
    color: "#FF6B6B",
    screen: "PersonalLoanScreen",
    terms: [
      "minimum salary -15k",
      "maximum tenure -84 months",
      "maximum foir -75% as per customer profile",
      "salaried OD minimum salary -50k only listed company ",
      "personal loan and credit card BT option",
      "minimum loan amount -1lac & maximum -1CR (as per eligibility)",

    ],
    fields: [
      { key: "fulName", label: "Enter Your Full Name", type: "text", required: true },
      { key: "email", label: "Enter Your email", type: "text", required: true },
      { key: "phone", label: "Phone Number", type: "text", required: true },
      { key: "employmentType", label: "Employment Type", type: "picker", required: true, options: ["salaried", "self-employed","Business Owner", "Professional","SEP"] },
      { key: "company_name", label: "Enter Your company name", type: "text", required: true },
      { key: "monthly_income", label: "Enter Your Monthly income", type: "text", required: true },
      { key: "existing_emis", label: "Existing Your Emis", type: "text", required: true },
      { key: "loan_amount", label: "Loan Amount", type: "currency", required: true },
      { key: "tenure", label: "Tenure (Years)", type: "picker", required: true, options: ["1 Year", "2 Years", "3 Years", "4 Years", "5 Years"] },
      { key: "cibil_score", label: "cibil score", type: "number", required: true }
    ]
  },
  {
    id: "auto-loan",
    name: "Auto Loan",
    icon: "car",
    description: "Finance your dream vehicle",
    color: "#4ECDC4",
    screen: "AutoLoanScreen",
    terms: [
      "Product Like New Car . Used Car ( BT + Refinance + Sale Purchase)",
      "New Car product is doable up to 100% of ex-showroom or 85% of on road calculation,",
      "Used Car Product Sale Purchase done up to 85% to 90% of actual valuation.",
      "BT is doable as per Emi paid for existing loans and we do till 190% of actual valuation as per client eligibility, if 12 emi paid then 150% , if 18 emi paid then 165 to 175% LTV if 24 paid then it goes till upto 190% of valuation.",
      "Refinance also doable upto valuation only and 85% of valuation in asset base,"
    ],
    fields: [
      { key: "full_name", label: "Enter Your Full Name", type: "text", required: true },
      { key: "email", label: "Enter Your Email", type: "text", required: true },
      { key: "phone_number", label: "Phone Number", type: "text", required: true },

      {
        key: "vehicle_type",
        label: "Vehicle Type",
        type: "picker",
        required: true,
        options: ["New Car", "Used Car", "New Two Wheeler", "Used Two Wheeler"]
      },

      { key: "vehicle_value", label: "Vehicle Value", type: "currency", required: true },

      { key: "emis_paid", label: "Existing EMIs Paid", type: "number", required: true }
    ]
  },

  {
    id: "lap",
    name: "Loan Against Property (LAP)",
    icon: "home-city",
    description: "Leverage your property",
    color: "#F7DC6F",
    screen: "LAPScreen",
    terms: [
      "Home loan/LAP - minimum amount 10lac ",
      "3 year income continuity 75% LTV resi, 65% commercial & 50% industrial property ",
      "can consider cash salary or cash income can consider family income also consider cash rental",
    ],
    fields: [
      // Basic User Details (from API)
      { key: "full_name", label: "Enter Your Full Name", type: "text", required: true },
      { key: "email", label: "Enter Your Email", type: "text", required: true },
      { key: "phone_number", label: "Phone Number", type: "text", required: true },

      // Loan Amount
      { key: "loan_amount", label: "Loan Amount", type: "currency", required: true },

      // Property Value
      { key: "property_value", label: "Property Value", type: "currency", required: true },

      // Income Continuity
      {
        key: "income_continuity",
        label: "Income Continuity",
        type: "picker",
        required: true,
        options: ["Stable", "Moderate", "Irregular"]
      },

      // Employment Status → Maps to your "Property Type" logic
      {
        key: "employment_status",
        label: "Employment Status",
        type: "picker",
        required: true,
        options: ["Residential", "Commercial", "Industrial","Land"]
      }
    ]

  },
  {
    id: "business-loan",
    name: "Business Loan",
    icon: "briefcase",
    description: "Grow your business",
    color: "#FFA07A",
    screen: "BusinessLoanScreen",
    terms: [
      "Minimum business Vintage - 2 Year ",
      "Loan Amount - 5 Lac to 75 Lac",
      "Tenure - 24 months to 48 months Business turnover - >50  lac Minimum monthly average bank balance - 25K",
      "Rate of Interest - based on client profile",
      "Loan Insurance - according to the applicant age",
      "Minimum Cibil Score- 700",
      "Ownership Proof"
    ],
    fields: [
      // User details
      { key: "full_name", label: "Enter Your Full Name", type: "text", required: true },
      { key: "email", label: "Enter Your Email", type: "text", required: true },
      { key: "phone_number", label: "Phone Number", type: "text", required: true },

      // Business details
      { key: "business_name", label: "Business Name", type: "text", required: true },

      {
        key: "business_type",
        label: "Business Type",
        type: "picker",
        required: true,
        options: ["Proprietorship", "Partnership", "Private Limited", "LLP", "Startup"]
      },

      // Financials
      { key: "annual_turnover", label: "Annual Turnover", type: "currency", required: true },
      { key: "loan_amount", label: "Loan Amount", type: "currency", required: true },
      { key: "collateral_value", label: "Collateral Value", type: "currency", required: true },

      {
        key: "business_continuity",
        label: "Business Continuity (Years)",
        type: "picker",
        required: true,
        options: ["1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"]
      }
    ]

  },

  {
    id: "machinery-loan",
    name: "Machinery Loan",
    icon: "factory",
    description: "Finance equipment purchase",
    color: "#85C1E2",
    screen: "MachineryLoanScreen",
    terms: [
      "only non moveable machine consider ",
      "minimum cost 10 lac per unit",
      "business continuity 3years",
      "for startup other firm guarantee or co-applicant required",
    ],
    fields: [
      // Basic User Details
      { key: "full_name", label: "Enter Your Full Name", type: "text", required: true },
      { key: "email", label: "Enter Your Email", type: "text", required: true },
      { key: "phone_number", label: "Phone Number", type: "text", required: true },

      // Business Info
      { key: "business_name", label: "Business Name", type: "text", required: true },

      // Machinery Type → machine_type
      {
        key: "machine_type",
        label: "Machinery Type",
        type: "picker",
        required: true,
        options: [
          "New Machinery",
          "Used Machinery",
          "Construction Equipment",
          "Manufacturing Equipment",
          "Agricultural Equipment"
        ]
      },

      // Machinery Cost → machine_cost
      { key: "machine_cost", label: "Total Machinery Cost", type: "currency", required: true },

      // Loan Amount
      { key: "loan_amount", label: "Loan Amount", type: "currency", required: true },

      // Business Continuity
      {
        key: "business_continuity",
        label: "Business Continuity (Years)",
        type: "picker",
        required: true,
        options: ["1 Year", "2 Years", "3 Years", "5 Years", "7+ Years"]
      },

      // Co-Applicant
      { key: "co_applicant", label: "Co-Applicant Name (Optional)", type: "text", required: false }
    ]
  },
  {
    id: "private-funding",
    name: "Private Funding",
    icon: "hand-coin",
    description: "Flexible funds from private lenders/NBFC partners",
    color: "#E91E63",
    screen: "PrivateFundingScreen",
    terms: [
      "Only for SEP and SENP.",
      "⁠Min. Turnover - 2 Cr +",
      "Owned office / residence.",
      "⁠Not ok for Muslim / Jaat / Gurjar / single lady.",
      "⁠Bad Cibil and Overleverage customer are welcome",
      "⁠Funding 10 Lac to 5 Cr but only for 4 months Maximum."
    ],
    fields: [
      // User Details
      { key: "full_name", label: "Enter Your Full Name", type: "text", required: true },
      { key: "email", label: "Enter Your Email", type: "text", required: true },
      { key: "phone_number", label: "Phone Number", type: "text", required: true },

      // Loan Details
      { key: "loan_amount", label: "Loan Amount", type: "currency", required: true },

      // Annual Turnover
      { key: "annual_turnover", label: "Annual Turnover", type: "currency", required: true },

      // Employment Type (API expects: "SEP", "Salaried", "Self-Employed", etc.)
      {
        key: "employment_type",
        label: "Employment Type",
        type: "picker",
        required: true,
        options: ["SEP","SENP"]
      },

      // Funding Purpose → Maps your "Event Type"
      {
        key: "funding_purpose",
        label: "Event / Funding Purpose",
        type: "picker",
        required: true,
        options: [
          "Wedding",
          "Reception",
          "Anniversary",
          "Birthday Party",
          "Corporate Event",
          "Other"
        ]
      }
    ]
  }
];

export const getLoanById = (id) => {
  return loanTypes.find(loan => loan.id === id);
};

export const getLoanByName = (name) => {
  return loanTypes.find(loan => loan.name === name);
};
