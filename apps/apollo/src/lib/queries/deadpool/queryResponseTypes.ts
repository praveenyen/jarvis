export type UpdateRegCheckRequest = {
  status: string;
};

export type UpdateRegCheckRequestV3 = {
  status: string;
  payload:{
    workflowId: string;
    loanProduct: string;
  }
};

export type UpdateRegCheckResponse = {
  status: string;
};

export type GetRegCheckDetailed = {
  status: string;
  result: {
    applicationStatus: string;
    regCheckSection: RegCheckSection;
    errorSection: {
      errorCode: string;
      errorKey: string;
      details: {
        error: string;
      };
    };
  };
};

/*const a: RegCheckSection = [
  {
    applicantDetails: {
      address: '',
      age: 15,
      applicantId: 17568,
      gender: 'F',
      name: 'a'
    },
    applicantStatus: 'rejected',
    source: {}
  }
]*/

type RegCheckSection = Array<{
  applicantDetails: RegCheckApplicantDetails;
  applicantStatus: ApplicantStatus;
  source: RegCheckSources;
}>;

export type RegCheckApplicantDetails = {
  address: string;
  age: number;
  applicantId: number;
  gender: string;
  name: string;
};

export type ApplicantStatus = 'rejected' | 'approved';

export type RegCheckSources = {
  [key: string]: [
    {
      applicantScore: ApplicantScore;
      misc: RegCheckMisc;
    },
  ];
};

type ApplicantScore = {
  address: number | null;
  age: number | null;
  gender: number | null;
  name: number | null;
};

export type RegCheckMisc = {
  [key: string]: string;
};

/*SAMPLE DETAILED RESPONSE*/
/*
{
  "status": "2",
  "result": {
  "applicationStatus": "rejected",
    "regCheckSection": [
    {
      "applicantDetails": {
        "address": "",
        "age": null,
        "applicantId": 17568,
        "gender": null,
        "name": "S R TRADING COMPANY"
      },
      "applicantStatus": "approved",
      "source": {
        "aibea": [],
        "eur_council": [],
        "eur_union": [],
        "mof_japan": [],
        "myneta": [],
        "ofac": [],
        "uapa": [],
        "unscr": [],
        "world_bank": [],
        "yugo": []
      }
    },
    {
      "applicantDetails": {
        "address": "PLOT NO. 855/13/A, SAI NAGAR, PREM NAGAR, SHANTI NAGAR ROAD, NAGPUR CITY, NAGPUR, Nagpur, MH",
        "age": 24,
        "applicantId": 232187,
        "gender": "M",
        "name": "MOHAMMAD SHAHID MEMON"
      },
      "applicantStatus": "approved",
      "source": {
        "aibea": [],
        "eur_council": [],
        "eur_union": [],
        "mof_japan": [],
        "myneta": [],
        "ofac": [],
        "uapa": [],
        "unscr": [],
        "world_bank": [],
        "yugo": []
      }
    },
    {
      "applicantDetails": {
        "address": "C/O: Abdul Wahid Vichhi Memon, Plot No. 855/13/A, Sai Nagar, Prem Nagar, VTC: Nagpur City, PO: Nagpur City, Sub District: Nagpur, District: Nagpur, State: Maharashtra, Nagpur, MH",
        "age": 45,
        "applicantId": 232188,
        "gender": "F",
        "name": "CHO CHUN RYONG"
      },
      "applicantStatus": "rejected",
      "source": {
        "aibea": [],
        "eur_council": [],
        "eur_union": [
          {
            "applicantScore": {
              "address": null,
              "age": null,
              "gender": null,
              "name": 100
            },
            "misc": {
              "address": "",
              "address_asatlistingtime": null,
              "address_city": null,
              "address_contactinfo": null,
              "address_countrydescription": null,
              "address_countryiso2code": null,
              "address_logicalid": null,
              "address_place": null,
              "address_pobox": null,
              "address_region": null,
              "address_regulation_entryintoforcedate": null,
              "address_regulation_numbertitle": null,
              "address_regulation_organisationtype": null,
              "address_regulation_programme": null,
              "address_regulation_publicationdate": null,
              "address_regulation_publicationurl": null,
              "address_regulation_type": null,
              "address_regulationlanguage": null,
              "address_remark": null,
              "address_street": null,
              "address_zipcode": null,
              "age1": null,
              "age2": null,
              "birthdate_birthdate": null,
              "birthdate_calendartype": null,
              "birthdate_circa": null,
              "birthdate_city": null,
              "birthdate_countrydescription": null,
              "birthdate_countryiso2code": null,
              "birthdate_day": null,
              "birthdate_logicalid": null,
              "birthdate_month": null,
              "birthdate_place": null,
              "birthdate_region": null,
              "birthdate_regulation_entryintoforcedate": null,
              "birthdate_regulation_numbertitle": null,
              "birthdate_regulation_organisationtype": null,
              "birthdate_regulation_programme": null,
              "birthdate_regulation_publicationdate": null,
              "birthdate_regulation_publicationurl": null,
              "birthdate_regulation_type": null,
              "birthdate_regulationlanguage": null,
              "birthdate_remark": null,
              "birthdate_year": null,
              "birthdate_yearrangefrom": null,
              "birthdate_yearrangeto": null,
              "birthdate_zipcode": null,
              "citizenship_countrydescription": null,
              "citizenship_countryiso2code": null,
              "citizenship_logicalid": null,
              "citizenship_region": null,
              "citizenship_regulation_entryintoforcedate": null,
              "citizenship_regulation_numbertitle": null,
              "citizenship_regulation_organisationtype": null,
              "citizenship_regulation_programme": null,
              "citizenship_regulation_publicationdate": null,
              "citizenship_regulation_publicationurl": null,
              "citizenship_regulation_type": null,
              "citizenship_regulationlanguage": null,
              "citizenship_remark": null,
              "created_at": "2024-02-21T17:16:28.227063",
              "dob1": null,
              "dob2": null,
              "entity_designationdate": "11/30/16",
              "entity_designationdetails": null,
              "entity_eu_referencenumber": "EU.4068.18",
              "entity_logicalid": "108672",
              "entity_regulation_entryintoforcedate": "9/1/17",
              "entity_regulation_numbertitle": "2017/1509 (OJ L224)",
              "entity_regulation_organisationtype": "council",
              "entity_regulation_programme": "PRK",
              "entity_regulation_publicationdate": "8/31/17",
              "entity_regulation_publicationurl": "http://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32017R1509&from=EN",
              "entity_regulation_type": "repealing",
              "entity_remark": "(Date of UN designation: 2016-11-30)\\n(Date of designation: 30.11.2016)",
              "entity_subjecttype": "P",
              "entity_subjecttype_classificationcode": "person",
              "entity_unitednationid": null,
              "filegenerationdate": "6/2/24",
              "id": 11344,
              "identification_countrydescription": null,
              "identification_countryiso2code": null,
              "identification_diplomatic": null,
              "identification_issuedby": null,
              "identification_issueddate": null,
              "identification_knownexpired": null,
              "identification_knownfalse": null,
              "identification_latinnumber": null,
              "identification_logicalid": null,
              "identification_nameondocument": null,
              "identification_number": null,
              "identification_region": null,
              "identification_regulation_entryintoforcedate": null,
              "identification_regulation_numbertitle": null,
              "identification_regulation_organisationtype": null,
              "identification_regulation_programme": null,
              "identification_regulation_publicationdate": null,
              "identification_regulation_publicationurl": null,
              "identification_regulation_type": null,
              "identification_regulationlanguage": null,
              "identification_remark": null,
              "identification_reportedlost": null,
              "identification_revokedbyissuer": null,
              "identification_typecode": null,
              "identification_typedescription": null,
              "identification_validfrom": null,
              "identification_validto": null,
              "namealias_firstname": "Cho",
              "namealias_function": "Chairman of the Second Economic Committee (SEC)",
              "namealias_gender": null,
              "namealias_lastname": "Ryong",
              "namealias_logicalid": null,
              "namealias_middlename": "Chun",
              "namealias_namelanguage": null,
              "namealias_regulation_entryintoforcedate": null,
              "namealias_regulation_numbertitle": null,
              "namealias_regulation_organisationtype": null,
              "namealias_regulation_programme": null,
              "namealias_regulation_publicationdate": null,
              "namealias_regulation_publicationurl": null,
              "namealias_regulation_type": null,
              "namealias_regulationlanguage": null,
              "namealias_remark": null,
              "namealias_title": null,
              "namealias_wholename": "Cho Chun Ryong",
              "updated_at": null
            }
          }
        ],
        "mof_japan": [],
        "myneta": [],
        "ofac": [],
        "uapa": [],
        "unscr": [
          {
            "applicantScore": {
              "address": null,
              "age": null,
              "gender": null,
              "name": 100
            },
            "misc": {
              "age1": null,
              "age2": null,
              "created_at": "2024-02-21T17:16:30.146696",
              "designation": "Chairman of the Second Economic Committee (SEC)",
              "dob": "nan",
              "dob1": null,
              "dob2": null,
              "id": 10,
              "name": "CHO CHUN RYONG",
              "nationality": "Democratic People''ss Republic of Korea",
              "pob": null,
              "updated_at": null
            }
          }
        ],
        "world_bank": [],
        "yugo": []
      }
    }
  ],
    "errorSection": null
}
}
*/
