import {IonItem, IonLabel, IonInput, IonSelect, IonSelectOption} from '@ionic/react';
import React from 'react';
import './ParamSelect.css';

interface ContainerProps {
  params: any;
}
interface StringIter {
  [index: string]: any,
}

const years: string[] = [];
for (let i = 2019; i > 1948; i--) {
  years.push(`${i.toString()}-${(i+1).toString().substring(2)}`)
}

const selectChanged = (e: any, setState: any, param: any) => {
  setState((v:any) => {return {...v, [param]: e.detail.value}})
}

const ParamSelect: React.FC<any> = (params) => {
  let setState = params.setState;
  let param = params.param;
  let pattern = params.pattern;
  let required = params.required;
  let state = params.state;

  let paramTypes: StringIter = {
    "LeagueID": (
      <IonItem>
        <IonLabel color={required ? "danger" : ""} position="stacked">{params.param}</IonLabel>
        <IonSelect value={state ? state : "00"} interface="popover" onIonChange={(e) => {selectChanged(e, setState, param)}}>
          <IonSelectOption value="00">NBA</IonSelectOption>
          <IonSelectOption value="01">ABA</IonSelectOption>
          <IonSelectOption value="20">G League</IonSelectOption>
          <IonSelectOption value="10">WNBA</IonSelectOption>
        </IonSelect>
      </IonItem>
    ),
    "Season": (
      <IonItem>
        <IonLabel color={required ? "danger" : ""} position="stacked">{params.param}</IonLabel>
        <IonSelect value={state ? state : "2019-20"} onIonChange={(e) => {selectChanged(e, setState, param)}}>
          {years.map((option, index) => {
            return <IonSelectOption key={index} value={option}>{option}</IonSelectOption>
          })}
        </IonSelect>
      </IonItem>
    )
  }

//  let options: string[] = pattern ? pattern.match(/[\w|\s|-]{3,}/g) : null;
  let options: string[] = pattern ? pattern.match(/([A-Z][A-Z|a-z|\s]*)/g) : null;
  if (options) {
    paramTypes[param] = (
      <IonItem>
        <IonLabel color={required ? "danger" : ""} position="stacked">{params.param}</IonLabel>
        <IonSelect value={state ? state : options[0]} interface="popover" onIonChange={(e) => {selectChanged(e, setState, param)}}>
          {options.map((option, index) => {
            return <IonSelectOption key={index} value={option}>{option}</IonSelectOption>
          })}
        </IonSelect>
      </IonItem>
    )
  }

  let def = (
    <IonItem>
      <IonLabel color={required ? "danger" : ""} position="stacked">{params.param}</IonLabel>
      <IonInput onIonChange={(e) => {selectChanged(e, setState, param)}} placeholder="enter text"></IonInput>
    </IonItem>
  );

  if (!state) {
    if (param === "LeagueID")
      selectChanged({detail: {value: "00"}}, setState, param)
    if (param === "Season")
      selectChanged({detail: {value: "2019-20"}}, setState, param)
    if (options)
      selectChanged({detail: {value: options[0]}}, setState, param)
  }

  return paramTypes[param] ? paramTypes[param] : def;
};

export default ParamSelect;
