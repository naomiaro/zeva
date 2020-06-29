import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Accordion from '../../app/components/Accordion';
import AccordionPanel from '../../app/components/AccordionPanel';

import SalesSubmissionSignaturesModal from './SalesSubmissionSignaturesModal';
import ValidationErrorsTable from './ValidationErrorsTable';
import VINTable from './VINTable';

import CustomPropTypes from '../../app/utilities/props';


const SalesSubmissionValidationPage = (props) => {
  const {
    backToStart,
    details,
    setShowModal,
    showModal,
    sign,
    user,
  } = props;

  const [valid, setValid] = useState([]);
  const [previouslyValidated, setPreviouslyValidated] = useState([]);
  const [noProvincialMatch, setnoProvincialMatch] = useState([]);
  const [VINMismatch, setVINMismatch] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    const newValid = [];
    const newPreviouslyValidated = [];
    const newNoProvincialMatch = [];
    const newVINMismatch = [];

    // eslint-disable-next-line array-callback-return
    details.entries.map((e) => {
      switch (e.vin_validation_status) {
        case 'VALID':
          newValid.push(e);
          break;
        case 'UNCHECKED': // @todo enable VIN checking. This is just for the demo
          newValid.push(e);
          break;
        case 'MODEL_MISMATCH':
        case 'MODELYEAR_MISMATCH':
          newVINMismatch.push(e);
          break;
        case 'NOT_IN_PROVINCIAL_RECORDS':
          newNoProvincialMatch.push(e);
          break;
        case 'PREVIOUSLY_MATCHED':
          newPreviouslyValidated.push(e);
          break;
        default:
          break;
      }
    });

    setValid(newValid);
    setPreviouslyValidated(newPreviouslyValidated);
    setnoProvincialMatch(newNoProvincialMatch);
    setVINMismatch(newVINMismatch);
    setValidationErrors(details.validation_problems);
  }, [details]);

  const actionbar = (
    <div className="row">
      <div className="col-sm-12">
        <div className="action-bar">
          <span className="left-content">
              Step 2 of 3
          </span>
          <span className="right-content">
            <button
              className="button"
              onClick={() => backToStart()}
              type="button"
            >
              <FontAwesomeIcon icon="arrow-left" /> Restart Submission
            </button>
            <button
              className="button primary"
              onClick={() => {
                setShowModal(true);
              }}
              type="button"
            >
              <FontAwesomeIcon icon="arrow-right" /> Proceed to Signature
            </button>
          </span>
        </div>
      </div>
    </div>
  );

  const modal = (
    <SalesSubmissionSignaturesModal
      handleCancel={() => {
        setShowModal(false);
      }}
      handleSubmit={() => {
        sign(details.id);
      }}
      showModal={showModal}
      user={user}
    />
  );

  return (
    <div id="sales-validate" className="page">

      <div className="row">
        <div className="col-sm-12">
          <h1>{user.organization.name} Sales Submission {details.submissionID}</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <strong>{`${details.entries.length} VIN uploaded`}</strong><br />
          <strong>{`${previouslyValidated.length + noProvincialMatch.length + VINMismatch.length} VIN had validation issues`}</strong><br />
          <strong>{`${validationErrors.length} data validation errors occurred`}</strong><br />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <Accordion>
            <AccordionPanel
              title={`${previouslyValidated.length} VIN had been previously validated and will be removed from this submission`}
            >
              <VINTable data={previouslyValidated} />
            </AccordionPanel>
            <AccordionPanel
              title={`${VINMismatch.length} VIN does not match expected values for the specified vehicle or model year and have been removed from this submission`}
            >
              <VINTable data={VINMismatch} />
            </AccordionPanel>
            <AccordionPanel
              title={`${noProvincialMatch.length} VIN did not validate with provincial registry data and have been saved separately in draft`}
            >
              <VINTable data={noProvincialMatch} />
            </AccordionPanel>
            <AccordionPanel title={`${validationErrors.length} entries had miscellaneous validation errors`}>
              <ValidationErrorsTable data={validationErrors} />
            </AccordionPanel>
            <AccordionPanel
              title={`${valid.length} VIN validated as follows and can be submitted to the Government of British Columbia for the credit totals indicated below`}
              startExpanded
            > <VINTable data={valid} />
            </AccordionPanel>
          </Accordion>
        </div>
      </div>
      {actionbar}
      {modal}
    </div>
  );
};

SalesSubmissionValidationPage.defaultProps = {};

SalesSubmissionValidationPage.propTypes = {
  backToStart: PropTypes.func.isRequired,
  details: PropTypes.shape({
    id: PropTypes.number,
    submissionID: PropTypes.string.isRequired,
    entries: PropTypes.arrayOf(PropTypes.object),
    validation_problems: PropTypes.arrayOf(PropTypes.any),
  }).isRequired,
  setShowModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  sign: PropTypes.func.isRequired,
  user: CustomPropTypes.user.isRequired,
};

export default SalesSubmissionValidationPage;
