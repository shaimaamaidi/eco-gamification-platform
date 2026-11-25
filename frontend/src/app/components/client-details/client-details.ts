import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClientDto } from '../../services/models';

@Component({
  selector: 'app-client-details',
  standalone : true,
  imports: [CommonModule],
  templateUrl: './client-details.html',
  styleUrl: './client-details.css'
})
export class ClientDetails {
  @Input() client!:ClientDto;
}
