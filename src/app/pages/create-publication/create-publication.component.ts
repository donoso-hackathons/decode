import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { IUSER_POST_BLOG } from 'src/app/shared/models';

@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.scss']
})
export class CreatePublicationComponent implements AfterViewInit {
  blog_state!: { action?: 'new' | 'edit'; blog?: IUSER_POST_BLOG };
  constructor(    public cd: ChangeDetectorRef,) { }

  ngAfterViewInit(): void {
    const newBlog: IUSER_POST_BLOG = {
      status: 'draft',
      timeStamp: new Date().getTime(),
      updateTimeStamp: new Date().getTime(),
      type: 'blog',
      uid: 'this.user.uid',
      id: 'randomString(20)',
      likes: 0,
      payload: {
        title: '',
        description: '',
        keywords: '',
        tags: [],
        content: `<h1>Un título claro y conciso</h1><figure class="image"><img src="https://storage.googleapis.com/inci-public/members/PfBCYRA0yrZOES4Iy1XzEMnd2re2/profile/S4IWFNCd6j.png"></figure><p>Luego escogerás una foto que indique lo que mñas quieras resaltar de tu perfil, si eres divulgador@, si tienes una tienda Online, etc..</p><p>Siempre es importante una ‘bullet’ list para que conozcan rápidamente tus servicios:</p><ul><li>Tienda Online</li><li>Marcas Exclusivas</li><li>Comsñetica para todos los bolsillos</li></ul><p>Si quieres resaltar alguna información puedes hacerlo utilizando la bombilla:</p><aside class="success-box"><span class="success-title">Aqui quiero dar una <strong>idea</strong>, comentar algun <strong>éxito</strong></span></aside><aside class="alert-box"><span class="alert-title"><strong>OJO </strong>aqui escribiremos algún peligro o cosa a tener en cueta</span></aside><p>Para información utiliza el <strong>azul</strong></p><p>Tabién puedo escribir reseñas que nos han dejado, los clientes dicen</p><blockquote><p>"Un lugar espectacular, en cuanto pueda volveré!,</p></blockquote><p>&nbsp;</p><p>Puedes hacer muchas cosas con el editor, insertar links, cambiar el color de la letra o el tamaño, pero no lo ovides que lo mñas importante es lo que digas sobre ti para que te cnozcan.</p>`,
        category: { available: false, meta: '' },
        image: { available: false, image: '' },
      },
    };
    //this.initStatus();
    this.blog_state = { action: 'new', blog: newBlog };

    this.cd.detectChanges();
  }

  editorChanged() {}

}
