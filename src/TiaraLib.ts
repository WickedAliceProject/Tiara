module TiaraLib
{

	function ConvertLower( c: string ) { return '-' + String.fromCharCode( c.charCodeAt( 0 ) | 32 ); }

	/*export class _StyleSheet
	{
		private element: HTMLStyleElement;
		private sheet: StyleSheet;
		constructor()
		{
			this.element = document.createElement('style');
			this.element.appendChild( document.createTextNode('') );
			document.head.appendChild( this.element );
			this.sheet = <StyleSheet>this.element.sheet;
		}
	}*/

	export class Style
	{
		public selector: string;
		private style: { [ key in keyof CSSStyleDeclaration ]?: string };
		private rules: Style[];
		private element: HTMLStyleElement;

		constructor( selector: string )
		{
			this.selector = selector;
			this.style = {};
			this.rules = [];
		}

		// CSSStyleDeclaration
		public set( name: keyof CSSStyleDeclaration | { [ key in keyof CSSStyleDeclaration ]?: string }, value: string = '' )
		{
			if ( name === 'length' || name === 'parentRule' ) { return this; }
			if ( typeof name === 'string' )
			{
				this.style[ name ] = value;
			} else
			{
				Object.keys( name ).forEach( ( key: keyof CSSStyleDeclaration ) =>
				{
					if ( key === 'length' || key === 'parentRule' ) { return this; }
					this.style[ key ] = name[ key ] || '';
				} );
			}
			return this;
		}

		public unset( ...names: (keyof CSSStyleDeclaration)[] )
		{
			names.forEach( ( name ) => { delete this.style[ name ]; } );
			return this;
		}

		// CSSRule
		public add( style: Style | string )
		{
			if ( typeof style === 'string' )
			{
				const selectors = style.split( ' ' );
				const selector = selectors.shift() || '';
				let _style = <Style>this.search( selector );
				if ( !_style )
				{
					_style = new Style( selector );
					this.rules.push( _style );
				}
				selectors.forEach( ( selector ) =>
				{
					_style = _style.add( selector );
				} );

				return _style;
			}

			for ( let i = 0 ; i < this.rules.length ; ++i )
			{
				if ( this.rules[ i ].selector === style.selector )
				{
					this.rules[ i ] = style;
					// TODO: mearge inSelector
					return style;
				}
			}

			this.rules.push( style );
			return style;
		}

		public search( selector: string )
		{
			for ( let i = 0 ; i < this.rules.length ; ++i )
			{
				if ( this.rules[ i ].selector === selector )
				{
					return this.rules[ i ];
				}
			}
			return null;
		}

		public remove( selector: string )
		{
			for ( let i = 0 ; i < this.rules.length ; ++i )
			{
				if ( this.rules[ i ].selector === selector )
				{
					this.rules.splice( i, 1 );
					// TODO: check this.inSelector[ i ].inSelector
				}
			}
			return this;
		}

		public update( selector: string, name: keyof CSSStyleDeclaration | { [ key in keyof CSSStyleDeclaration ]?: string }, value: string = '' )
		{
			const rule = this.search( selector );
			if ( !rule ) { return null; }
			rule.set( name, value );
			return rule;
		}

		public clear( selector: string )
		{
			const rule = this.search( selector );
			if ( !rule ) { return this; }
			rule.style = {};
			return this;
		}

		public toStoring( selector: string = '' ): string
		{
			if ( selector )
			{
				if ( this.selector[ 0 ] === '&' )
				{
					selector += this.selector.substring( 1 );
				} else
				{
					selector += ' ' + this.selector;
				}
			} else { selector = this.selector; }

			//this.style.cssText;
			const style = Object.keys( this.style ).map( ( key: keyof CSSStyleDeclaration ) =>
			{
				return key.replace( /[A-Z]/g, ConvertLower ) + ':' + this.style[ key ];
			} ).join( ';' );
			return ( this.selector && style ? ( selector + '{' + style + '}' ) : '' ) + this.rules.map( ( rule ) => { return rule.toStoring( selector ); } ).join( '' );
		}

		// <style>
		private reflectStyleSheet()
		{
			if ( !this.element )
			{
				this.element = document.createElement( 'style' );
				this.element.appendChild( document.createTextNode( '' ) );
				document.head.appendChild( this.element );
			}
			this.element.textContent = this.toStoring();
			return this.element;
		}
	}

	export function CreateTemplateElement( contents: HTMLElement | string )
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

	export class Template
	{
		public static create( contents: HTMLElement | string )
		{
			return new Template( CreateTemplateElement( contents ) );
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
}