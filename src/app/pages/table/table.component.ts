import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ CommonModule,HttpClientModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [GithubService]
})
export class TableComponent {
  issues: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 22;
  totalItems: number = 0;
  isLoading: boolean = false; 
  sortColumn: string = ''
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(private githubService: GithubService,  private route: ActivatedRoute,private router: Router) { }



  toggleSort(column: string) {
    let order = 'asc';
    if (this.sortColumn === column) {
      order = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.updateQueryParams({ sort: column, order: order, page: 1 });
  }

  getItemRangeText(): string {
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(startItem + this.itemsPerPage - 1, this.totalItems);
    return `Showing ${startItem} to ${endItem} of ${this.totalItems} items`;
  }


  updateQueryParams(params: {}) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  sortIssues() {
    this.issues.sort((a, b) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      // Adjust for different data types
      if (this.sortColumn === 'createdAt' || this.sortColumn === 'updatedAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] ? Number(params['page']) : 1;
      this.sortColumn = params['sort'] || 'createdAt';
      this.sortDirection = params['order'] || 'desc';
      this.loadIssues();
    });
  }

  loadIssues() {
    this.isLoading = true;
    this.githubService.fetchIssues(this.sortColumn, this.sortDirection,  this.currentPage,  this.itemsPerPage).subscribe({
      next: (data) => {
         // api data in an array
        this.issues = data.items.map((issue: any) => ({
          createdAt: issue.created_at,
          updatedAt: issue.updated_at,
          title: issue.title
        }));
        this.totalItems = data.total_count;
        this.isLoading = false;
        console.log('Fetched api data:', data);
      },
      error: (error) => {
        console.error('Error fetching issues:', error);
        this.isLoading = false;
      }
    });
  }

  

  onPageChange(page: number) {
    this.updateQueryParams({ page: page });
  }


  backtoMain(){
    this.router.navigate(['']);
  }

}
