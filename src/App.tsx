import Menu from './components/Menu';
import Page from './pages/Page';
import React, { useState, useEffect } from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane, IonPage } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import FloatingDialog from "./components/FloatingDialog";

/* Theme variables */
import './theme/variables.css';

import endPoints from './data/endPoints.json';

let firstProp:string = "";
interface StringIter {
  [index: string]: any,
}
let endPointsS: StringIter = endPoints;
for (let prop in endPointsS) {
  if (endPointsS[prop].status !== "deprecated") {
    firstProp = prop;
    break;
  }
}

const defaultProxy = "https://cors-anywhere.herokuapp.com/";
const defaultHeaders = JSON.stringify({
  "x-nba-stats-origin": "stats",
  "x-nba-stats-token": "true",
  "origin": "https://stats.nba.com",
  "Referer": "https://stats.nba.com",
  "User-Agent": "Firefox/55.0",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate",
  "DNT": "1",
})

const App: React.FC = () => {
  let savedProxy = localStorage.getItem('proxy');
  savedProxy = savedProxy !== null && savedProxy !== undefined ? savedProxy : defaultProxy;
  let savedHeaders:any = localStorage.getItem('headers');
  savedHeaders = savedHeaders !== null && savedHeaders !== undefined ? savedHeaders : defaultHeaders;

  const [selectedPage, setSelectedPage] = useState('');
  const [widthLoaded, setWidthLoaded] = useState(false);
  const [proxy, setProxy] = useState(savedProxy);
  const [headers, setHeaders] = useState(savedHeaders);

  useEffect(() => {
    if (proxy)
      localStorage.setItem('proxy', proxy);
    if (headers)
      localStorage.setItem('headers', headers);
  }, [proxy, headers])

  useEffect(() => {
    let checkWidthLoaded = setInterval(check, 100);
    function check () {
      if (document.body.clientWidth !== 0) {
        setWidthLoaded(true);
        clearInterval(checkWidthLoaded);
      }
    };
  }, [])


  return (
    <>
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu selectedPage={selectedPage} {...{proxy, setProxy, headers, setHeaders}}/>
          <IonRouterOutlet id="main">
            <Route path="/page/:name" render={(props) => {
              setSelectedPage(props.match.params.name);
              return <Page {...props} {...{proxy, headers}} />;
            }} exact={true} />
            <Route path="/" render={() => <Redirect to={`/page/${firstProp}`} />} exact={true} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
      {
        !widthLoaded ? <IonPage></IonPage> : <FloatingDialog />
      }
    </>
  );
};

export default App;
