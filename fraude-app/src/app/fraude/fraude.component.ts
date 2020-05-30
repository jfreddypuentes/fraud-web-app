import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Api} from '../api/api';
import {PredictRequest} from './models/PredictRequest';
import {PredictResponse} from './models/PredictResponse';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-fraude',
  templateUrl: './fraude.component.html',
  styleUrls: ['./fraude.component.css']
})
export class FraudeComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private api: Api) { }

  fraudForm: FormGroup;
  inselectTipoPersona = 0;
  inselectActividadEconomica = 0;
  inselectTipoDocumento = 0;
  ininputNumeroDocumento = 0;
  inselectTipoCotizante = 0;
  inselectSubtipoCotizante = 0;
  ininputEdad = 0;
  ininputTasaHonestidad = 0;

  prediction: PredictResponse;
  showResult = false;

  formIncomplete = false;


  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public fraude = { data: [], label: 'Fraude' };
  public noFraude = { data: [], label: 'No Fraude' };

  public barChartData: ChartDataSets[] = [
    this.fraude
  ];

  ngOnInit() {
    this.fraudForm = this.formBuilder.group({
      selectTipoPersona: ['', Validators.required],
      selectActividadEconomica: ['', Validators.required],
      selectTipoDocumento: ['', Validators.required],
      inputNumeroDocumento: ['', Validators.required],
      selectTipoCotizante: ['', Validators.required],
      selectSubtipoCotizante: ['', Validators.required],
      inputEdad: ['', Validators.required],
      inputTasaHonestidad: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('onSummit()');
    this.inselectTipoPersona = + this.getValueFormByKey('selectTipoPersona');
    this.inselectActividadEconomica = + this.getValueFormByKey('selectActividadEconomica');
    this.inselectTipoDocumento = + this.getValueFormByKey('selectTipoDocumento');
    this.ininputNumeroDocumento = + this.getValueFormByKey('inputNumeroDocumento');
    this.inselectTipoCotizante = + this.getValueFormByKey('selectTipoCotizante');
    this.inselectSubtipoCotizante = + this.getValueFormByKey('selectSubtipoCotizante');
    this.ininputEdad = + this.getValueFormByKey('inputEdad');
    this.ininputTasaHonestidad = + this.getValueFormByKey('inputTasaHonestidad');

    if (this.isFormValid()) {
      this.predict();
      this.formIncomplete = false;
    } else {
      this.formIncomplete = true;
    }

  }

  isFormValid() {
    return this.inselectTipoPersona != null
      && this.inselectActividadEconomica != null
      && this.inselectTipoDocumento != null
      && this.ininputNumeroDocumento != null
      && this.inselectTipoCotizante != null
      && this.inselectSubtipoCotizante != null
      && this.ininputEdad != null
      && this.ininputTasaHonestidad;
  }

  getValueFormByKey(key: string) {
    return this.fraudForm.get(key).value;
  }

  predict() {
    const payload = new PredictRequest(this.inselectTipoPersona,
      this.inselectActividadEconomica,
      this.inselectSubtipoCotizante,
      this.inselectTipoCotizante,
      this.ininputEdad,
      this.ininputTasaHonestidad);
    this.api.predict(payload)
      .subscribe(response => {
        console.log(response);
        this.prediction = response;
        this.showResult = this.prediction.status === 'OK';
        if (this.showResult) {
          this.refreshHistogram();
        }
      });
  }

  refreshHistogram() {
    this.fraude = { data: [+this.prediction.data.average], label: 'Fraude' };
    this.noFraude = { data: [1 - (+this.prediction.data.average)], label: 'No Fraude' };
    this.barChartData = [
      this.fraude
      ];
  }

}
