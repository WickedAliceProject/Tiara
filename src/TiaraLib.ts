function ConvertLower( c: string ) { return '-' + String.fromCharCode( c.charCodeAt( 0 ) | 32 ); }



	class Tiara
	{

	public static createTemplateElement( contents: HTMLElement | string )
	{
		const template = document.createElement( 'template' );

		if ( typeof contents !== 'string' )
		{
			template.content.appendChild( contents );
			return template;
		}

		const parent = document.createElement( 'div' );
		parent.innerHTML = contents;
		const children = parent.children;
		for ( let i = 0 ; i < children.length ; ++i )
		{
			template.content.appendChild( children[ i ] );
		}

		return template;
	}
		public static create( contents: HTMLElement | string )
		{
			return new Tiara( this.createTemplateElement( contents ) );
		}


		protected template: HTMLTemplateElement;

		/** Create template.
		Set HTMLTemplateElement. If set empty or notfound id, create defaultTemplate.
		@param template HTMLTemplate ... set, string ... ID
		*/
		constructor( template?: HTMLTemplateElement | string )
		{
			this.setTemplate( template );
		}

		/** Create default template[Override]
		Call on Tiara.setTemplate
		@return Default template.
		*/
		protected defaultTemplate(): HTMLTemplateElement
		{
			return document.createElement( 'template' );
		}

		/** Before set template event[Override]
		@param template Before set Tiara.template
		@return false ... Do not set template. other ... Set template.
		*/
		protected onSetTemplate( template: HTMLTemplateElement ) { return true; }

		public setTemplate( template?: HTMLTemplateElement | string )
		{
			if ( typeof template === 'string' )
			{
				template = <HTMLTemplateElement>document.getElementById( template );
			}
			if ( !template || !template.content )
			{
				// Not HTMLTemplateElement
				template = this.defaultTemplate();
			}

			if ( this.onSetTemplate( template ) !== false )
			{
				this.template = template;
			}

			return this.get();
		}

		public querySelectorAll<T extends HTMLElement>( selector: string )
		{
			const list: T[] = [];
			const elements = this.template.content.querySelectorAll( selector );
			for ( let i = 0 ; i < elements.length; ++i )
			{
				list.push( <T>elements[ i ] );
			}
			return list;
		}

		public clearTemplate()
		{
			const parent = this.getContent();
			const children = parent.children;
			for ( let i = children.length - 1 ; 0 <= i ; --i )
			{
				parent.removeChild( children[ i ] );
			}
		}

		public get() { return this.template; }

		public getContent() { return this.get().content; }

		public getCloneNode( deep: boolean = true ) { return document.importNode( this.getContent(), deep ); }

		/** Render template in target HTMLElement.
		Note: Delete all target children.
		@param target Render target HTMLElement.
		*/
		public renderTemplate( target: HTMLElement )
		{
			if ( !target ) { return; }
			const children = target.children;
			if ( !children ) { return; }
			for ( let i = children.length - 1 ; 0 <= i ; --i ) { target.removeChild( children[ i ] ); }
			target.appendChild( this.getCloneNode() );
		}
	}
