import {IonItem, IonLabel, IonInput, IonSelect, IonSelectOption} from '@ionic/react';
import React from 'react';
import './ParamSelect.css';

interface ContainerProps {
  params: any;
}
interface StringIter {
  [index: string]: any,
}

const statCategories: any[] = [
  {name: "Points", value: "PTS"},
  {name: "Rebounds", value: "REB"},
  {name: "Assists", value: "AST"},
  {name: "Blocks", value: "BLK"},
  {name: "Steals", value: "STL"},
  {name: "Def Rebounds", value: "DREB"},
  {name: "Off Rebounds", value: "OREB"},
  {name: "3pt %", value: "FG3_PCT"},
  {name: "3pt Attempts", value: "FG3A"},
  {name: "3pt Makes", value: "FG3M"},
  {name: "Field Goal %", value: "FG_PCT"},
  {name: "Field Goal Attempts", value: "FGA"},
  {name: "Field Goal Makes", value: "FGM"},
  {name: "Free Throw Attempts", value: "FTA"},
  {name: "Free Throw Makes", value: "FTM"},
  {name: "Turnovers", value: "TOV"},
];


const selectChanged = (e: any, setState: any, param: any) => {
  setState((v:any) => {return {...v, [param]: e.detail.value}})
}

const ParamSelect: React.FC<any> = (params) => {
  let setState = params.setState;
  let param = params.param;
  let pattern = params.pattern;
  let required = params.required;
  let state = params.state;
  let endPoint = params.endPoint;

  const years: string[] = [];
  for (let i = 2019; i > 1948; i--) {
    let year = endPoint !== "DraftHistory" ? `${i.toString()}-${(i+1).toString().substring(2)}` : `${i.toString()}`
    years.push(year)
  }
  let paramTypes: StringIter = {}

  let options: string[] = pattern ? pattern.match(/(?<=\().*?(?=\))/g) : null;
  // eslint-disable-next-line
  if (options && options[0].indexOf("\d") === -1) {
    options = options.map((string, index) => {
      return string.replace("(", "");
    })
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

  paramTypes.LeagueID = (
    <IonItem>
      <IonLabel color={required ? "danger" : ""} position="stacked">{params.param}</IonLabel>
      <IonSelect value={state ? state : "00"} interface="popover" onIonChange={(e) => {selectChanged(e, setState, param)}}>
        <IonSelectOption value="00">NBA</IonSelectOption>
        <IonSelectOption value="01">ABA</IonSelectOption>
        <IonSelectOption value="20">G League</IonSelectOption>
        <IonSelectOption value="10">WNBA</IonSelectOption>
      </IonSelect>
    </IonItem>
  );
  paramTypes.StatCategory =  (
    <IonItem>
      <IonLabel color={required ? "danger" : ""} position="stacked">{params.param}</IonLabel>
      <IonSelect value={state ? state : statCategories[0].value} interface="popover" onIonChange={(e) => {selectChanged(e, setState, param)}}>
        {statCategories.map((option, index) => {
          return <IonSelectOption key={index} value={option.value}>{option.name}</IonSelectOption>
        })}
      </IonSelect>
    </IonItem>
  );
  paramTypes.Season = paramTypes.SeasonYear = (
    <IonItem>
      <IonLabel color={required ? "danger" : ""} position="stacked">{params.param}</IonLabel>
      <IonSelect value={state ? state : years[0]} onIonChange={(e) => {selectChanged(e, setState, param)}}>
        {years.map((option, index) => {
          return <IonSelectOption key={index} value={option}>{option}</IonSelectOption>
        })}
      </IonSelect>
    </IonItem>
  )


  let def = (
    <IonItem>
      <IonLabel color={required ? "danger" : ""} position="stacked">{params.param}</IonLabel>
      <IonInput onIonChange={(e) => {selectChanged(e, setState, param)}} placeholder="enter text"></IonInput>
    </IonItem>
  );

  if (!state) {
    if (param === "LeagueID")
      selectChanged({detail: {value: "00"}}, setState, param)
    if (param === "Season" || param === "SeasonYear")
      selectChanged({detail: {value: years[0]}}, setState, param)
    // eslint-disable-next-line
    if (options && options[0].indexOf("\d") === -1)
      selectChanged({detail: {value: options[0]}}, setState, param)
    if (param === "StatCategory")
      selectChanged({detail: {value: statCategories[0].value}}, setState, param)
  }

  return paramTypes[param] ? paramTypes[param] : def;
};

export default ParamSelect;
