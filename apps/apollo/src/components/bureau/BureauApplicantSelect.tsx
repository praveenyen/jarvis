import React from 'react';

type BureauApplicantViewProps = {
  appFormId: string;
};

const BureauApplicantView: React.FC<BureauApplicantViewProps> = ({
  appFormId,
}) => {
  return (
    <div>
      <h1>Bureau Applicant View</h1>
      <p>App Form ID: {appFormId}</p>
    </div>
  );
};

export default BureauApplicantView;
