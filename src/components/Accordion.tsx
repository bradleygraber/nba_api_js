import { IonItem, IonCard, IonLabel } from '@ionic/react';
import React, { useState } from 'react';
import "./Accordion.css";

const Accordion: React.FC<any> = (props) => {
  let [visible, setVisible] = useState(false);
  return (
    <>
    <IonItem
      onClick={(e) => setVisible(!visible)}
      class="ion-text-center"
      button>
    <IonLabel>
      Select Favorites
    </IonLabel>
    </IonItem>
    <IonCard class={visible ? "visibleAccordion" : "hiddenAccordion"}>
      {props.children}
    </IonCard>
    </>
  );
};

export default Accordion;
