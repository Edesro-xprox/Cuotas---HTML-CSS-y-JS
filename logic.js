$(function() {
    let dx = {
        gridPersonas: null,
        frmCuotas: null,
        mdlCuotas: null,
        gridCuotas: null,
        frmPersona: null,
        tbarCuotas: null
    }

    //Formulario para cuotas
    dx.frmCuotas = $('<div>').dxForm({
        colCount: 2,
        items:[
            {
                colSpan: 1,
                dataField: 'monto',
                label: { text: 'Monto', location: 'top' },
                editorType: 'dxTextBox',
                editorOptions: {

                }
            },
            {
                colSpan: 1,
                dataField: 'estado',
                label: { text: 'Estado', location: 'top' },
                editorType: 'dxTextBox',
                editorOptions: {
                    
                }
            }
        ]
    }).dxForm('instance');

    //Modal para cuotas
    dx.mdlCuotas = $('<div>').dxPopup({
        width: 500,
        height: 250,
        title: 'Registro de cuotas',
        contentTemplate: dx.frmCuotas.element(),
        toolbarItems: [
            {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options:{
                    text: 'Guardar',
                    hint: 'Guardar data de cuotas',
                    type: 'success',
                    onClick: () =>{

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

                    }
                }
            }
        ]
    }).dxPopup('instance');

    //Grilla de personas
    dx.gridPersonas = $("<div>").dxDataGrid({
        dataSource: [],
        columns: [
            {
                dataField: 'personaId',
                caption: '',
                visible: false
            },
            {
                dataField: "Nombre",
                caption: "Nombres"
            },
            {
                dataField: "Apellido",
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
                dataField: "Estado",
                caption: "Estado",
                alignment: 'center'
            },
            {
                dataField: 'btnDetalle',
                caption: '',
                cellTemplate: (container,e) =>{
                    container.addClass('centerElement');

                    $('<div>').dxButton({
                        hint: 'Ver detalle de la persona',
                        icon: 'bi bi-arrow-right',
                        type: 'secondary',
                        onClick: (e) =>{
                            dx.mvCuotas.option('selectedIndex',1);
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
                            dx.mvCuotas.option('selectedIndex',1);
                        }
                    }
                }
            ]
        }
    }).dxDataGrid('instance');

    dx.tbarCuotas = $('<div>').addClass('card card-body p-2 mb-3').dxToolbar({
        items:[
            {
                widget: 'dxButton',
                options:{
                    text: 'Volver', icon: 'arrowleft', hint: 'Volver',
                    onClick: (e) =>{
                        dx.mvCuotas.option('selectedIndex',0);
                    }
                },
                location: 'after'
            },
            {
                widget: 'dxButton',
                options:{
                    text: 'Guardar', icon: 'save', hint: 'Guardar datos', type: 'success',
                    onClick: (e) =>{
                        let valid = dx.frmPersona.validate();
                        if(valid.isValid){
                            let data = dx.frmPersona.option('formData');
                            console.log('data',data);
                            let cuotas = dx.gridCuotas.option('dataSource');
                            console.log('cuotas',cuotas);


                        }
                    }
                },
                location: 'after'
            }
        ]
    }).dxToolbar('instance');

    //Grilla de cuotas
    dx.gridCuotas = $("<div>").dxDataGrid({
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
                alignment: 'center'
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
                            dx.mdlCuotas.show();
                        }
                    }
                }
            ]
        }
    }).dxDataGrid('instance');

    //Formulario de datos persona
    dx.frmPersona = $('<div>').dxForm({
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
            }
        ]
    }).dxForm('instance');

    //Vistas
    dx.mvCuotas = $('#mvCuotas').dxMultiView({
        items:[
            {
                title: "",
                template: (itemData,itemIndex,itemElement) => {
                    let divPersonas = $('<div>').addClass('card')
                        .append(
                            $('<div>').addClass('card-body').append(
                                dx.gridPersonas.element()
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
                                    $('<p>').addClass('fs-4').text('Información personal'),
                                    dx.frmPersona.element()
                                )
                            ),
                            $('<div>').addClass('col-7').append(
                                $('<div>').addClass('card card-body').append(
                                    dx.gridCuotas.element()
                                )
                            ),
                            dx.mdlCuotas.element()
                        )

                    itemElement.append(dx.tbarCuotas.element(),divFormulario);
                }
            }
        ],
        selectedIndex: 0, 
        loop: true,        
        swipeEnabled: true,
        animationEnabled: true 
    }).dxMultiView('instance');
});