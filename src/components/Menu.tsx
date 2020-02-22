import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { star, starOutline } from 'ionicons/icons';
import './Menu.css';

import Accordion from './Accordion';

import endPoints from '../data/endPoints.json';

interface MenuProps extends RouteComponentProps {
  selectedPage: string;
}

interface AppPage {
  url: string;
  title: string;
  favorite: boolean;
}
interface StringIter {
  [index: string]: any,
}
let endPointsS: StringIter = endPoints;
let endPointArray: AppPage[] = []
let favs: any = {};
for (let prop in endPointsS) {
  if (endPointsS[prop].status !== "deprecated") {
    endPointArray.push({title: prop, url: `/page/${prop}`, favorite: false});
    favs[prop] = false;
  }
}

const Menu: React.FunctionComponent<MenuProps> = ({ selectedPage }) => {
  let savedFavorites = localStorage.getItem('favorites');
  savedFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};

  let [favorites, setFavorites] = useState<any>(savedFavorites);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites])

  let favArray = [];
  for (let prop in favorites) {
    if (favorites[prop].favorite)
      favArray.push(favorites[prop])
  }
  let favs = favArray.map((appPage, index) => {
    return (
      <IonMenuToggle key={index} autoHide={false}>
        <IonItem className={selectedPage === appPage.title ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
          <IonButton slot="end" fill="clear"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFavorites((v: any) => {return { ...v, [appPage.title]: {title: appPage.title, url: appPage.url, favorite: favorites[appPage.title] ? !favorites[appPage.title].favorite : true} }})
            }}>
            <IonIcon slot="icon-only" icon={(favorites[appPage.title] && favorites[appPage.title].favorite) ? star : starOutline} />
          </IonButton>
          <IonLabel>{appPage.title}</IonLabel>
        </IonItem>
      </IonMenuToggle>
    );
  })
  let nonFavs = (endPointArray.map((appPage, index) => {
    return (
      <IonItem key={index} className={selectedPage === appPage.title ? 'selected noPadding' : 'noPadding'} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
        <IonButton slot="end" fill="clear" class="noPadding"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFavorites((v: any) => {return { ...v, [appPage.title]: {title: appPage.title, url: appPage.url, favorite: favorites[appPage.title] ? !favorites[appPage.title].favorite : true} }})
          }}>
          <IonIcon slot="icon-only" icon={(favorites[appPage.title] && favorites[appPage.title].favorite) ? star : starOutline} />
        </IonButton>
        <IonLabel class="noPadding">{appPage.title}</IonLabel>
      </IonItem>
    );
  }));

  return (
    <IonMenu contentId="main" type="overlay">
    <IonHeader>
      <IonToolbar>
        <IonTitle>nba_api Endpoints Client</IonTitle>
        <a id="titleUrl" target="_blank" rel="noopener noreferrer" href="https://github.com/swar/nba_api">https://github.com/swar/nba_api</a>
      </IonToolbar>
    </IonHeader>
      <IonContent>
        <IonList>
          {favs}
        </IonList>
        <Accordion>
          {nonFavs}
        </Accordion>
      </IonContent>
    </IonMenu>
  );
};

export default withRouter(Menu);
