import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonCol,
  IonToolbar, IonGrid, IonRow, IonButton, IonAlert } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import ParamSelect from '../components/ParamSelect';
import './Page.css';
import eps from '../data/endPoints.json';

import DataTable from 'react-data-table-component';


interface StringIter {
  [index: string]: any,
}
let endPoints: StringIter = eps;

const timeout = (ms: number, promise:Promise<any>) => {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"))
    }, ms)
    promise.then(resolve, reject)
  })
}
const download = (filename:string, text:string) => {
  let trimmedFilename = filename.match(/(?:.+?stats.nba.com\/stats\/)(.+)/);
  filename = trimmedFilename && trimmedFilename.length > 1 ? trimmedFilename[1] : filename
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
const csv = (arr: any[]) => {
  if (arr.length < 1)
    return "";

  let csv = arr[0].join(",") + "\n";
  let headers = arr[0];
  for (let i = 1; i < arr.length; i++) {
    csv += headers.map((header: string) => arr[i][header]).join(",") + "\n";
  }
  return csv;
}

const Page: React.FC<any> = ({ match, proxy, headers }) => {
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
    var url = proxy + `https://stats.nba.com/stats/${endPoint.toLowerCase()}?`;

    for (let prop in params) {
      url += prop + "=" + params[prop].replace(/\s/g, '+') + "&";
    }

    try {
      var parsed: any = JSON.parse(headers);
    }
    catch (e) {}
    let parsedHeaders = parsed ? parsed : {};

    var requestOptions:any = {
      method: 'GET',
      headers: parsedHeaders,
    };

    let data = await timeout(6000, fetch(url, requestOptions))
      .then(async (response:any) => {
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
    url = url.substring(0, url.length - 1);
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
            <IonButton onClick={(e:any) => {request(endPoint, paramState)}}>Submit Query</IonButton>
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
        <IonRow  class="ion-text-center">
          <IonCol>
            <IonButton class={data.length > 0 ? "" : "ion-hide"} onClick={(e:any) => {download(href+".csv", csv([columns.map((col:any) => col.name), ...data]))}}>Export CSV</IonButton>
          </IonCol>
        </IonRow>
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
