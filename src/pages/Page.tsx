import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonCol,
  IonToolbar, IonGrid, IonRow, IonButton, IonAlert } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import ParamSelect from '../components/ParamSelect';
import './Page.css';
import eps from '../data/endPoints.json';

import DataTable from 'react-data-table-component';


interface StringIter {
  [index: string]: any,
}
let endPoints: StringIter = eps;





const Page: React.FC<RouteComponentProps<{ name: string; }>> = ({ match }) => {
  let endPoint = match.params.name;
  let patterns = endPoints[endPoint].parameter_patterns;
  let requiredParams = endPoints[endPoint].required_parameters;

  let [paramState, setParamState] = useState<any>({});
  let [showAlert, setShowAlert] = useState(false);
  let [alertText, setAlertText] = useState("");
  let [loading, setLoading] = useState(false);

  let [href, setHref] = useState("");

  let [columns, setColumns] = useState<any>([]);
  let [data, setData] = useState<any>([]);

  let generateTableData = (data: any) => {
    let rowData = data.length > 0 ? data[0].rowSet : data.rowSet;
    let headers = data.length > 0 ? data[0].headers: data.headers;

    let outputRowData: any[] = [];
    let outputHeaderData: any[] = [];
    rowData.forEach((row:any, rowIndex:any) => {
      let rowObj: StringIter = {}
      row.forEach((col: any, colIndex: any) => {
        rowObj[headers[colIndex]] = col;
      })
      outputRowData.push({...rowObj})
    });
    headers.forEach((header: any, index: any) => {
      outputHeaderData.push({name: header, selector: header, center: true, sortable: true})
    })
    setColumns(outputHeaderData);
    setData(outputRowData);
    setLoading(false);
  }
  const request = async (endPoint: string, params: any) => {
    setLoading(true);
    var url = `http://localhost:8080/https://stats.nba.com/stats/${endPoint.toLowerCase()}?`;

    for (let prop in params) {
      url += prop + "=" + params[prop].replace(/\s/g, '+') + "&";
    }

    var myHeaders = new Headers();
    myHeaders.append("x-nba-stats-origin", "stats");
    myHeaders.append("x-nba-stats-token", "true");
    myHeaders.append("origin", "https://stats.nba.com");
    myHeaders.append("Referer", "https://stats.nba.com");

    var requestOptions:any = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let data = await fetch(url, requestOptions)
      .then(async response => {
        if (response.status === 200)
          return response.json();
        else {
          let message = await response.text();
          throw Error(message);
        }
      })
      .then(result => result)
      .catch(error => {
        setAlertText(error);
        setShowAlert(true);
        setLoading(false);
      });

    if (data && data.resultSets)
      generateTableData(data.resultSets);
    if (data && data.resultSet)
      generateTableData(data.resultSet);
  }

  useEffect(() => {
    setParamState({});
  }, [match])

  useEffect(() => {
    var url = `http://stats.nba.com/stats/${endPoint.toLowerCase()}?`;
    for (let prop in paramState) {
      url += prop + "=" + paramState[prop].replace(/\s/g, '+') + "&";
    }
    setHref(url);
  }, [paramState, endPoint])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{match.params.name}</IonTitle>
          <a id="titleUrl" title={href} target="_blank" rel="noopener noreferrer" href={href}>Current Query URL</a>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid><IonRow>
          {endPoints[endPoint].parameters.map((param: string, index:number) => {
            return (
              <IonCol key={index} class="minWidth">
                <ParamSelect
                index={index}
                param={param}
                pattern={patterns[param]}
                required={requiredParams.includes(param)}
                state={paramState[param]}
                setState={setParamState}
                endPoint={endPoint}
                />
              </IonCol>
            )
          })}
        </IonRow>
        <IonRow class="ion-text-center">
          <IonCol>
            <IonButton onClick={(e:any) => {request(endPoint, paramState)}}>Submit</IonButton>
          </IonCol>
        </IonRow>
        <IonRow><IonCol>
          <DataTable
            noHeader={true}
            columns={columns}
            data={data}
            dense={true}
            progressPending={loading}
            striped={true}
            pagination={true}
          />
        </IonCol></IonRow>
        </IonGrid>
      </IonContent>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Bad Request'}
        message={alertText}
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default Page;
