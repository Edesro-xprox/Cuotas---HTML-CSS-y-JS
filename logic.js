class Cuotas{
    personas = null;
    cuotas = null;
    personaId = 0;
    cuotaId = 0;

    constructor(){
        this.init();
    }

    async init(){
        this.devex();
        await this.cargarPersonas();
        await this.cargarCuotas();
    }

    devex(){
        this.dx = {
            gridPersonas: null,
            btnGuardarPersona: null,
            frmCuotas: null,
            mdlCuotas: null,
            mdlEliminarCuota: null,
            gridCuotas: null,
            frmPersona: null,
            tbarCuotas: null,
            toast: null
        }
        
        this.dx.toast = $("#toast").dxToast({
            message: "",
            type: "", // 'info', 'warning', 'error', or 'success'
            displayTime: 3000, // Time in milliseconds
            position: {
                my: "bottom", // Position relative to the screen
                at: "bottom",
                of: window
            }
        }).dxToast('instance');
    
        //Formulario para cuotas
        this.dx.frmCuotas = $('<div>').dxForm({
            colCount: 2,
            items:[
                {
                    colSpan: 1,
                    dataField: 'monto',
                    label: { text: 'Monto', location: 'top' },
                    editorType: 'dxNumberBox',
                    editorOptions: {
                        placeholder: 'Ingrese el monto de la cuota'
                    },
                    validationRules: [
                        { type: "required", message: "El monto es obligatorio" }
                    ]
                },
                {
                    colSpan: 1,
                    dataField: 'estado',
                    label: { text: '¿Pagado?', location: 'top' },
                    editorType: 'dxCheckBox',
                    editorOptions:{
                        value: false
                    }
                }
            ]
        }).dxForm('instance');
    
        //Modal para cuotas
        this.dx.mdlCuotas = $('<div>').dxPopup({
            width: 500,
            height: 250,
            title: 'Registro de cuotas',
            contentTemplate: () => this.dx.frmCuotas.element(),
            toolbarItems: [
                {
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'after',
                    options:{
                        text: 'Guardar',
                        hint: 'Guardar cuota',
                        type: 'success',
                        onClick: () =>{
                            let valid = this.dx.frmCuotas.validate();
                            if(valid.isValid){
                                let cuota = this.dx.frmCuotas.option('formData');
    
                                if(Boolean(this.personaId)){
                                    if(Boolean(this.cuotaId)){
                                        this.guardarCuota(this.personaId,this.cuotaId, cuota);
                                    }else{
                                        this.nuevaCuota(cuota);
                                    }
                                }else{
                                    this.dx.toast.option('message','Debe llenar los datos personales de la persona primero');
                                    this.dx.toast.option('type','warning');
                                    this.dx.toast.show();
                                }
                            }else{
                                this.dx.toast.option('message','Debe completar todos los campos requeridos');
                                this.dx.toast.option('type','warning');
                                this.dx.toast.show();
                            }
                        }
                    }
                },
                {
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'after',
                    options:{
                        text: 'Cancelar',
                        hint: 'Cancelar cambios',
                        type: 'normal',
                        onClick: () =>{
                            this.dx.mdlCuotas.hide();
                        }
                    }
                }
            ],
            onHidden: () =>{
                this.dx.frmCuotas.resetValues();
            }
        }).dxPopup('instance');

        this.dx.mdlEliminarCuota = $('<div>').dxPopup({
            width: 400,
            height: 'auto',
            title: 'Eliminar cuota',
            contentTemplate: (element) => {
                $(element).append(`<p class="text-center fs-5">'¿Desea eliminar esta cuota?</p><p class="text-center fs-6">Este proceso no sera revertible</p>`);
            },
            toolbarItems: [
                {
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'center',
                    options:{
                        text: 'Aceptar',
                        hint: 'Eliminar cuota',
                        type: 'default',
                        onClick: () =>{
                            this.eliminarCuota(this.personaId,this.cuotaId);
                        }
                    }
                },
                {
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'center',
                    options:{
                        text: 'Cancelar',
                        hint: 'Cancelar',
                        type: 'normal',
                        onClick: () =>{
                            this.dx.mdlEliminarCuota.hide();
                        }
                    }
                }
            ]
        }).dxPopup('instance');
        
        //Grilla de personas
        this.dx.gridPersonas = $("<div>").dxDataGrid({
            dataSource: [],
            columns: [
                {
                    dataField: 'personaId',
                    caption: '',
                    visible: false
                },
                {
                    dataField: "nombres",
                    caption: "Nombres"
                },
                {
                    dataField: "apellidos",
                    caption: "Apellidos"
                },
                {
                    dataField: "numero",
                    caption: "Numero",
                    alignment: 'center'
                },
                {
                    dataField: "ubicacion",
                    caption: "Ubicación"
                },
                {
                    dataField: "estado",
                    caption: "Estado",
                    alignment: 'center',
                    cellTemplate: (container,e) =>{
                        let estado = e.row.data.estado; 
                        $(`<div class="${estado ? 'bg-success' : 'bg-danger'}">`).css({
                            'color': 'white',
                            'border-radius': '5px',
                            'width': '75%',
                            'padding': '1%',
                            'margin': '0 auto 0 auto'
                        }).text(estado ? "Pagado" : "No pagado").appendTo(container);
                    }
                },
                {
                    dataField: 'btnDetalle',
                    caption: '',
                    cellTemplate: (container,e) =>{
                        container.addClass('text-center');
    
                        $('<div>').dxButton({
                            hint: 'Ver detalle de la persona',
                            icon: 'bi bi-arrow-right',
                            type: 'secondary',
                            onClick: () =>{
                                this.personaId = e.row.data.personaId;
                                this.dx.mvCuotas.option('selectedIndex',1);
    
                                this.dx.frmPersona.option('formData',{
                                    nombres: e.row.data.nombres,
                                    apellidos: e.row.data.apellidos,
                                    numero: e.row.data.numero,
                                    ubicacion: e.row.data.ubicacion,
                                    monto: e.row.data.monto
                                });
    
                                this.dx.gridCuotas.option('dataSource',this.cuotas.filter(c => c.personaId == this.personaId))
                            }
                        }).css({'border':'none'}).appendTo(container);
                    }
                }
            ],
            showBorders: true,
            toolbar: {
                items:[
                    {
                        widget: 'dxButton',
                        options:{
                            text: 'Agregar',
                            hint: 'Registrar nueva persona',
                            type: 'primary',
                            icon: 'plus',
                            onClick: (e) =>{
                                this.personaId = 0;
                                this.cuotaId = 0;
                                this.dx.mvCuotas.option('selectedIndex',1);
                                this.dx.frmPersona.resetValues();
                                this.dx.gridCuotas.option('dataSource',this.cuotas.filter(c => c.personaId == this.personaId));
                            }
                        }
                    }
                ]
            }
        }).dxDataGrid('instance');
    
        this.dx.tbarCuotas = $('<div>').addClass('card card-body p-2 mb-3').dxToolbar({
            items:[
                {
                    widget: 'dxButton',
                    options:{
                        text: 'Volver', icon: 'arrowleft', hint: 'Volver',
                        onClick: (e) =>{
                            this.dx.gridPersonas.refresh();
                            this.dx.mvCuotas.option('selectedIndex',0);
                        }
                    },
                    location: 'after'
                }
            ]
        }).dxToolbar('instance');
    
        //Grilla de cuotas
        this.dx.gridCuotas = $("<div>").dxDataGrid({
            dataSource: [],
            columns: [
                {
                    dataField: "cuotaId",
                    caption: "#Cuota",
                    visible: false
                },
                {
                    dataField: 'personaId',
                    caption: '',
                    visible: false
                },
                {
                    dataField: "monto",
                    caption: "Monto"
                },
                {
                    dataField: "estado",
                    caption: "Pagado/No Pagado",
                    alignment: 'center',
                    cellTemplate:(container,e) =>{
                        let row = e.row.data;
                        $('<div>').text(row.estado ? 'SI' : 'NO').appendTo(container);
                    }
                },
                {
                    type: 'buttons',
                    buttons:[
                        {
                            text: 'Editar',
                            hint: 'Editar cuota',
                            icon: 'edit',
                            onClick: (e) =>{
                                this.cuotaId = e.row.data.cuotaId;
                                
                                this.dx.frmCuotas.option('formData',{
                                    monto: e.row.data.monto,
                                    estado: e.row.data.estado
                                })

                                this.dx.mdlCuotas.option('title','Editar cuota');
                                this.dx.mdlCuotas.show();
                            }
                        },
                        {
                            text: 'Eliminar',
                            hint: 'Eliminar cuota',
                            icon: 'trash',
                            onClick: (e) =>{
                                this.cuotaId = e.row.data.cuotaId;
                                this.dx.mdlEliminarCuota.show();
                            }
                        }
                    ]
                }
            ],
            showBorders: true,
            toolbar:{
                items:[
                    {
                        text: 'Cuotas',
                        location: 'before'
                    },
                    {
                        widget: 'dxButton',
                        location: 'after',
                        options:{
                            hint:'Agregar cuota',
                            type: 'normal',
                            icon: 'plus',
                            onClick: () =>{
                                this.cuotaId = 0;

                                this.dx.mdlCuotas.option('title','Agregar cuota');
                                this.dx.mdlCuotas.show();
                            }
                        }
                    }
                ]
            }
        }).dxDataGrid('instance');
    
        //Botón para guardar data de personas
        this.dx.btnGuardarPersona = $('<span>').dxButton({
            text: '',
            type: 'success',
            icon: 'save',
            hint: 'Guardar datos de persona',
            onClick: (e) =>{
                let valid = this.dx.frmPersona.validate();
    
                if(valid.isValid){
                    let personas = this.dx.frmPersona.option('formData');
                    
                    if(Boolean(this.personaId)){
                        this.guardarDatosPersona(this.personaId, personas);
                    }else{   
                        this.crearNuevaPersona(personas);
                    }
                }else{
                    this.dx.toast.option('message','Debe llenar los campos requeridos');
                    this.dx.toast.option('type','warning');
                    this.dx.toast.show();
                }
            }
        }).dxButton('instance');
    
        //Formulario de datos persona
        this.dx.frmPersona = $('<div>').dxForm({
            items: [
                {
                    dataField: "nombres",
                    label: {
                        text: "Nombres"
                    },
                    editorType: 'dxTextBox',
                    editorOptions: {
                        placeholder: "Ingrese su nombre"
                    },
                    validationRules: [
                        { type: "required", message: "El nombre es obligatorio" }
                    ]
                },
                {
                    dataField: "apellidos",
                    label: {
                        text: "Apellidos"
                    },
                    editorType: 'dxTextBox',
                    editorOptions: {
                        placeholder: "Ingrese su apellido"
                    },
                    validationRules: [
                        { type: "required", message: "El apellido es obligatorio" }
                    ]
                },
                {
                    dataField: 'numero',
                    label:{ text: 'Número' },
                    editorType: 'dxTextBox',
                    editorOptions:{
                        placeholder: 'Ingrese su número'
                    }
                },
                {
                    dataField: 'ubicacion',
                    label : { text: 'Ubicación' },
                    editorType: 'dxTextBox',
                    editorOptions:{
                        placeholder: 'Ingrese su ubicación'
                    }
                },
                {
                    dataField: 'monto',
                    label: { text: 'Monto a pagar' },
                    editorType: 'dxTextBox',
                    editorOptions: {
                        placeholder: 'Ingrese el monto total a pagar'
                    },
                    validationRules: [
                        { type: "required", message: "El apellido es obligatorio" }
                    ]
                }
            ]
        }).dxForm('instance');
    
        //Vistas
        this.dx.mvCuotas = $('#mvCuotas').dxMultiView({
            items:[
                {
                    title: "",
                    template: (itemData,itemIndex,itemElement) => {
                        let divPersonas = $('<div>').addClass('card')
                            .append(
                                $('<div>').addClass('card-body').append(
                                    this.dx.gridPersonas.element()
                                )
                            )
                        itemElement.append(divPersonas)
                    }
                },
                {
                    title: "",
                    template: (itemData,itemIndex,itemElement) => {
                        let divFormulario = $('<div>').addClass('row')
                            .append(
                                $('<div>').addClass('col-5').append(
                                    $('<div>').addClass('card card-body').append(
                                        $('<div>').addClass('d-flex justify-content-between mb-3').append(
                                            $('<p>').addClass('fs-4 mb-0').text('Información personal'),
                                            this.dx.btnGuardarPersona.element()
                                        ),
                                        this.dx.frmPersona.element()
                                    )
                                ),
                                $('<div>').addClass('col-7').append(
                                    $('<div>').addClass('card card-body').append(
                                        this.dx.gridCuotas.element()
                                    )
                                ),
                                this.dx.mdlCuotas.element(),
                                this.dx.mdlEliminarCuota.element()
                            )
    
                        itemElement.append(this.dx.tbarCuotas.element(),divFormulario);
                    }
                }
            ],
            selectedIndex: 0, 
            loop: true,        
            swipeEnabled: true,
            animationEnabled: true 
        }).dxMultiView('instance');
    }

    async cargarPersonas(){
        try{
            let res = await fetch(`http://localhost:5000/personas`);
            if(res.ok){
                let data = await res.json(); 
                this.personas = [...data];
                this.dx.gridPersonas.option('dataSource',this.personas);
                console.log('personas',this.personas);
            }
        }catch(e){
            console.error(e)
        }
    }

    async cargarCuotas(){
        try{
            let res = await fetch(`http://localhost:5000/cuotas`);
            if(res.ok){
                let data = await res.json();
                this.cuotas = [...data];
                this.dx.gridCuotas.option('dataSource',this.cuotas.filter(c => c.personaId == this.personaId));
                console.log('cuotas',this.cuotas)
            }
        }catch(e){
            console.log(error)
        }
    }

    async crearNuevaPersona(personas){
        try{
            const { nombres, apellidos, numero, ubicacion, monto } = personas;

            let res = await fetch(`http://localhost:5000/personas`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({nombres: nombres.trim(), apellidos: apellidos.trim(), numero: numero?.trim() || '', ubicacion: ubicacion?.trim() || '', monto: monto.trim(), estado: 0 })
            })

            if(res.ok){
                let data = await res.json();
                await this.cargarPersonas();
                this.personaId = data[0].personaId;
                this.dx.toast.option('message','Datos personales guardados');
                this.dx.toast.option('type','success');
                this.dx.toast.show();
            }
        }catch(e){
            console.error('error',e);
        }
    }

    async guardarDatosPersona(personaId, personas){
        try{
            const { nombres, apellidos, numero, ubicacion, monto } = personas;
            
            let res = await fetch(`http://localhost:5000/personas/${personaId}`,{
                method: 'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({nombres: nombres, apellidos: apellidos, numero: numero.trim() || '', ubicacion: ubicacion.trim() || '', monto: monto, estado: 0 })
            });

            if(res.ok){
                await this.cargarPersonas();
                this.dx.toast.option('message','Datos personales actualizados');
                this.dx.toast.option('type','success');
                this.dx.toast.show();
            }
        }catch(e){
            console.error('error',e);
        }
    }

    async guardarCuota(personaId,cuotaId,cuota){
        try{
            let res = await fetch(`http://localhost:5000/cuotas/${personaId}/${cuotaId}`,{
                method: 'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(cuota)
                })
                
            if(res.ok){
                await this.cargarCuotas();
                this.dx.mdlCuotas.hide();
                this.dx.toast.option('message','Registro actualizado');
                this.dx.toast.option('type','success');
                this.dx.toast.show();
                this.cambioEstado(this.personaId);
            }
        }catch(e){
            console.error('error',e);
        }
    }

    async nuevaCuota(cuota){
        try{
            const { monto, estado } = cuota;
                                
            //Determinar nuevo id de cuotas
            let idsCuota = this.cuotas.map(c => c.cuotaId);
            let maxId = idsCuota.length > 0 ? Math.max(...idsCuota) + 1 : 0;

            let data = {
                cuotaId: maxId + 1,
                personaId: this.personaId,
                monto: monto,
                estado: estado
            }

            let res = await fetch(`http://localhost:5000/cuotas`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data)
                }) 

            if(res.ok){
                await this.cargarCuotas();
                this.dx.mdlCuotas.hide();
                this.dx.toast.option('message','Registrado exitosamente');
                this.dx.toast.option('type','success');
                this.dx.toast.show();
                this.cambioEstado(this.personaId);
            }
        }catch(e){
            console.error('error',e);
        }
    }

    async eliminarCuota(personaId,cuotaId){
        try{
            let res = await fetch(`http://localhost:5000/cuotas/${personaId}/${cuotaId}`,{
                method: 'DELETE',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            
            if(res.ok){
                await this.cargarCuotas();
                this.dx.mdlEliminarCuota.hide();
                this.dx.toast.option('message','Cuota eliminada');
                this.dx.toast.option('type','success');
                this.dx.toast.show();
                this.cambioEstado(this.personaId);
            }
        }catch(e){
            console.error('error',e);
        }
    }

    async cambioEstado(personaId){
        try{
            let { monto } = this.personas.find(p => p.personaId == personaId);
            let totalCuotas = this.cuotas.filter(c => c.personaId == personaId && c.estado).map(c => c.monto);
    
            totalCuotas.forEach(c => {
                monto -= c; 
            });
    
            let estado = { estado: monto === 0 ? true : false }
            
            let res = await fetch(`http://localhost:5000/personas/estado/${personaId}`,{
                method: 'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(estado)
            })
            
            if(res.ok){
                this.cargarPersonas();
            }
        }catch(e){
            console.error('error',e);
        }
    }
}

new Cuotas();