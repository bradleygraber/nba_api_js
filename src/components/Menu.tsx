import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { mailOutline, mailSharp } from 'ionicons/icons';
import './Menu.css';

import endPoints from '../data/endPoints.json';

interface MenuProps extends RouteComponentProps {
  selectedPage: string;
}

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}
interface StringIter {
  [index: string]: any,
}
let endPointsS: StringIter = endPoints;
let endPointArray: AppPage[] = []
for (let prop in endPointsS) {
  if (endPointsS[prop].status !== "deprecated")
    endPointArray.push({title: prop, url: `/page/${prop}`, iosIcon: mailOutline, mdIcon: mailSharp});
}

const Menu: React.FunctionComponent<MenuProps> = ({ selectedPage }) => {
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>nba_api Endpoints Client</IonListHeader>
          <IonNote><a target="_blank" rel="noopener noreferrer" href="https://github.com/swar/nba_api">https://github.com/swar/nba_api</a></IonNote>
          {endPointArray.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={selectedPage === appPage.title ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={appPage.iosIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default withRouter(Menu);
