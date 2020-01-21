/*
 * Container component
 * All data handling & manipulation should be handled here.
 */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ROUTES_VEHICLES from '../app/routes/Vehicles';
import VehicleDetailsPage from './components/VehicleDetailsPage';

const VehicleDetailContainer = (props) => {
  const [vehicle, setVehicle] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const { keycloak } = props;

  const refreshList = () => {
    setLoading(true);

    axios.get(ROUTES_VEHICLES.DETAILS.replace(/:id/gi, id)).then((response) => {
      setVehicle(response.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    refreshList();
  }, [keycloak.authenticated]);

  return (<VehicleDetailsPage loading={loading} details={vehicle} />);
};

VehicleDetailContainer.propTypes = {
  keycloak: PropTypes.shape({
    authenticated: PropTypes.bool,
  }).isRequired,
};

export default VehicleDetailContainer;
