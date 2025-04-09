import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');
    this.setActiveLink();
  }

  private showNavbar(toggleId: string, navId: string, bodyId: string, headerId: string) {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId),
          bodypd = document.getElementById(bodyId),
          headerpd = document.getElementById(headerId);

    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('show');
        toggle.classList.toggle('bx-x');
        bodypd.classList.toggle('body-pd');
        headerpd.classList.toggle('body-pd');
      });
    }
  }

  private setActiveLink() {
    const linkColor = document.querySelectorAll('.nav_link');

    function colorLink(this: Element) {
      linkColor.forEach(link => link.classList.remove('active'));
      this.classList.add('active');
    }

    linkColor.forEach(link => {
      link.addEventListener('click', colorLink);
    });
  }
}
