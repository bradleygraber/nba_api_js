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

const App: React.FC = () => {
  let savedProxy = localStorage.getItem('proxy');
  savedProxy = savedProxy !== undefined ? savedProxy : defaultProxy;

  const [selectedPage, setSelectedPage] = useState('');
  const [widthLoaded, setWidthLoaded] = useState(false);
  const [proxy, setProxy] = useState(savedProxy);

  useEffect(() => {
    localStorage.setItem('proxy', proxy);
    console.log("saving" + proxy)
  }, [proxy])

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
          <Menu selectedPage={selectedPage} setProxy={setProxy} proxy={proxy}/>
          <IonRouterOutlet id="main">
            <Route path="/page/:name" render={(props) => {
              setSelectedPage(props.match.params.name);
              return <Page {...props} {...{proxy}} />;
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
