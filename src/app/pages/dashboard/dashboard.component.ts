import { Component, HostListener, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from '../../core/services/navigation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  public sidebarService = inject(NavigationService);
  private readonly MOBILE_BREAKPOINT = 778;
  isOpen = true;

  ngOnInit() {
    this.checkWindowWidth();
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkWindowWidth();
  }

  private checkWindowWidth() {
    if (window.innerWidth < this.MOBILE_BREAKPOINT) {
      this.isOpen = false;
    } else {
      this.isOpen = true;
    }
  }
}
