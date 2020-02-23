import { IonContent, IonHeader, IonToolbar, IonTitle, IonPage, IonIcon, IonButton, IonTextarea} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { close } from 'ionicons/icons';

import Draggable from 'react-draggable';

import './FloatingDialog.css';

const FloatingDialog: React.FC<any> = () => {
  let savedScratches = localStorage.getItem('scratches');
  savedScratches = savedScratches ? savedScratches : "Enter whatever text you would like to keep here.";

  let [position, setPosition] = useState({x: 0, y: 0});
  let [dialogBoxIsVisible, setDialogBoxIsVisible] = useState(true);
  let [scratches, setScratches] = useState(savedScratches);

  let [bounds, setBounds] = useState({top: 0, left: 0, right: document.body.clientWidth-400, bottom: document.body.clientHeight-400});

  useEffect(() => {
    localStorage.setItem('scratches', scratches);
  }, [scratches])


  useEffect(() => {
    setBounds(dialogBoxIsVisible ?
      {top: 0, left: 0, right: document.body.clientWidth-400, bottom: document.body.clientHeight-50} :
      {top: 0, left: 0, right: document.body.clientWidth-400, bottom: document.body.clientHeight-50} );
  }, [dialogBoxIsVisible]);

  let startPosition = {x: document.body.clientWidth-400, y: 0}

  let handleDrag = (e:any, position: any) => {
    setPosition({x: position.x, y: position.y});
  }


  return (
        <Draggable bounds={bounds} position={position.x === 0 ? startPosition : position} onDrag={handleDrag} handle="#header">
        <IonPage id="dialogBox" className={dialogBoxIsVisible ? "dialogBox" : "dialogBox hidden"}>
          <IonHeader id="header">
            <IonToolbar color="primary">
              <IonTitle size="small" >Scratch Pad</IonTitle>
              <IonButton color="secondary" slot="end" fill="clear" onClick={() => setDialogBoxIsVisible(!dialogBoxIsVisible)}>
                <IonIcon slot="icon-only" icon={close} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
          <IonTextarea
              onIonChange={(e: any) => setScratches(e.detail.value)}
              autoGrow={true}
              value={scratches}>
            </IonTextarea>
          </IonContent>
        </IonPage>
      </Draggable>
  );
};

export default FloatingDialog;
