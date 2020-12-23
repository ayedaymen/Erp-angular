// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
// CRUD
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '../../_base/crud';
// Models
import { FactureModel } from '../_models/Facture.model';

const API_FACTURE__URL = 'api/factures';

@Injectable()
export class FacturesService {
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
  }

  // CREATE =>  POST: add a new Facture to the server
  createFacture(Facture: FactureModel): Observable<FactureModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<FactureModel>(API_FACTURE__URL+'/afficherFactures', Facture, {headers: httpHeaders});
  }

  // READ
  getAllFactures(): Observable<FactureModel[]> {
    return this.http.get<FactureModel[]>(API_FACTURE__URL+'/afficherFactures');
  }

  getFactureById(FactureId: number): Observable<FactureModel> {
    return this.http.get<FactureModel>(API_FACTURE__URL + `/${FactureId}`);
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  // Server should return filtered/sorted result
  findFactures(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

    const url = API_FACTURE__URL + '/find';
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  // UPDATE => PUT: update the Facture on the server
  updateFacture(Facture: FactureModel): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.put(API_FACTURE__URL, Facture, {headers: httpHeader});
  }

  // UPDATE Status
  updateStatusForFacture(Factures: FactureModel[], status: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {
      FacturesForUpdate: Factures,
      newStatus: status
    };
    const url = API_FACTURE__URL + '/updateStatus';
    return this.http.put(url, body, {headers: httpHeaders});
  }

  // DELETE => delete the Facture from the server
  deleteFacture(FactureId: number): Observable<FactureModel> {
    const url = `${API_FACTURE__URL}/${FactureId}`;
    return this.http.delete<FactureModel>(url);
  }

  deleteFactures(ids: number[] = []): Observable<any> {
    const url = API_FACTURE__URL + '/deleteFactures';
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const body = {FactureIdsForDelete: ids};
    return this.http.put<QueryResultsModel>(url, body, {headers: httpHeaders});
  }
}
