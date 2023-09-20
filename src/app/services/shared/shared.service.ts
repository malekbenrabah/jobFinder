import { Injectable } from '@angular/core';
import { Job } from '../user/model/Job';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor() { }

  /*
  private searchResultsSource = new Subject<Job[]>();
  searchResults$ = this.searchResultsSource.asObservable();

  setSearchResults(results: Job[]) {
    this.searchResultsSource.next(results);
  }
  */
 
  //store the search results
  private privateSearchResults: Job[] = [];  
  private searchResultsSource = new Subject<Job[]>();
  searchResults$ = this.searchResultsSource.asObservable();

  private hasSearchResults: boolean = false;
  setSearchResults(results: Job[]) {
    this.privateSearchResults = results; // update the private variable
    this.hasSearchResults = results.length > 0;
    this.searchResultsSource.next(results);
    
  }

  getSearchResults(): Job[] {
    // Return the search results from the private variable
    return this.privateSearchResults;
  }

  getHasSearchResults(): boolean {
    return this.hasSearchResults;
  }

  

  

}
