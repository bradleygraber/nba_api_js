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
  IonTitle, IonModal, IonGrid, IonRow, IonCol, IonInput
} from '@ionic/react';

import { menu } from 'ionicons/icons';

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

const Menu: React.FunctionComponent<any> = ({ selectedPage, setProxy, proxy, setHeaders, headers }) => {
  let savedFavorites = localStorage.getItem('favorites');
  savedFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};

  let [favorites, setFavorites] = useState<any>(savedFavorites);
  let [modalVisible, setModalVisible] = useState(false);
  let [localProxy, setLocalProxy] = useState(proxy);
  let [localHeaders, setLocalHeaders] = useState(headers);

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
        <IonButton
          slot="end"
          fill="clear"
          onClick={(e:any) => {e.preventDefault(); e.stopPropagation(); setModalVisible(true); }}><IonIcon slot="icon-only" icon={menu}/></IonButton>
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
      <IonModal isOpen={modalVisible}>
        <IonItem
          class="ion-text-center"
          color="primary">
          <IonLabel>
            Set Proxy & Headers
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Proxy URL</IonLabel>
          <IonInput value={localProxy} onIonChange={(e: any) => setLocalProxy(e.detail.value)}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Headers</IonLabel>
          <IonInput value={localHeaders} onIonChange={(e: any) => setLocalHeaders(e.detail.value)}></IonInput>
        </IonItem>
        <IonGrid>
        <IonRow>
          <IonCol>
            <IonButton onClick={() => setModalVisible(false)}>Cancel</IonButton>
          </IonCol>
          <IonCol>
            <IonButton onClick={() => {setProxy(localProxy); setHeaders(localHeaders); setModalVisible(false)}}>Set</IonButton>
          </IonCol>
        </IonRow>
        </IonGrid>
      </IonModal>
    </IonMenu>
  );
};

export default withRouter(Menu);
