import React, { Fragment, useEffect, useState } from 'react';
import { events, invoke } from '@forge/bridge';
import { handleFetchError, handleFetchSuccess } from './responseHandling';
import './css/app.css'

function App() {
  const [labelsData, setLabelsData] = useState(null);
  const [componentsData, setComponentsData] = useState(null);

  useEffect(() => {
    const fetchLabels = async () => invoke('fetchLabels');
    const fetchComponents = async () => invoke('fetchComponents');

    fetchLabels()
      .then((data) =>
        handleFetchSuccess(data, 'labels', setLabelsData)
      )
      .catch(handleFetchError('labels'));

    fetchComponents()
      .then((data) =>
        handleFetchSuccess(data, 'components', setComponentsData)
      )
      .catch(handleFetchError('components'));

    const subscribeForIssueChangedEvent = () =>
      events.on('JIRA_ISSUE_CHANGED', () => {
        fetchLabels()
          .then((data) =>
            handleFetchSuccess(data, 'labels', setLabelsData)
          )
          .catch(handleFetchError('labels'));

        fetchComponents()
          .then((data) =>
            handleFetchSuccess(data, 'components', setComponentsData)
          )
          .catch(handleFetchError('components'));
      });

    return () => {
      subscribeForIssueChangedEvent().then((subscription) => subscription.unsubscribe());
    };
  }, []);

  const renderLabels = () => {
    if (!labelsData) {
      return <div>Loading...</div>
    }
    return (
      labelsData.map((label) => <li>{label}</li>)
    )
  }

  const renderComponents = () => {
    if (!componentsData) {
      return <div>Loading...</div>;
    }
    return (
      componentsData.map((component) => <li>{component.name}</li>)
    )
  }

  return (
    <Fragment>
      <div className='issue-panel'>
        <span className='issue-panel__title'>Issue labels:</span>
        <ul>{renderLabels()}</ul>
      </div>
      <div className='issue-panel'>
        <span className='issue-panel__title'>Issue components:</span>
        <ul>{renderComponents()}</ul>
      </div>
    </Fragment>

  );
}

export default App;
