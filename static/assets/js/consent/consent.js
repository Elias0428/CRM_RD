
        document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('drawingCanvas');
            const ctx = canvas.getContext('2d');
            const form = document.getElementById('signatureForm');
            const signatureInput = document.getElementById('signatureInput');
            const clearCanvasButton = document.getElementById('clearCanvas');
        
            let drawing = false;
        
            // Configurar el estilo del dibujo
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#000';
        
            const startDrawing = (event) => {
                drawing = true;
                ctx.beginPath();
                ctx.moveTo(getX(event), getY(event));
            };
        
            const draw = (event) => {
                if (!drawing) return;
                ctx.lineTo(getX(event), getY(event));
                ctx.stroke();
            };
        
            const stopDrawing = () => {
                drawing = false;
                ctx.closePath();
            };
        
            const getX = (event) => {
                const rect = canvas.getBoundingClientRect();
                return event.touches ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
            };
        
            const getY = (event) => {
                const rect = canvas.getBoundingClientRect();
                return event.touches ? event.touches[0].clientY - rect.top : event.clientY - rect.top;
            };

            // Verificar si el canvas está vacío
            const isCanvasEmpty = () => {
                const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                for (let i = 0; i < pixels.length; i += 4) {
                    if (pixels[i + 3] !== 0) { // Comprueba si hay algún píxel no transparente
                        return false;
                    }
                }
                return true;
            };
        
            // Eventos de dibujo
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);
            canvas.addEventListener('touchstart', startDrawing);
            canvas.addEventListener('touchmove', draw);
            canvas.addEventListener('touchend', stopDrawing);
            canvas.addEventListener('touchcancel', stopDrawing);
        
            // Limpiar canvas
            clearCanvasButton.addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });
        
            // Antes de enviar el formulario, convierte el canvas a Base64
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                if (isCanvasEmpty()) {
                    canvas.focus()
                    alert('{% trans "Por favor, firma antes de enviar el formulario." %}');
                    return;
                }
                const canvasData = canvas.toDataURL('image/png'); // Base64 de la firma
                signatureInput.value = canvasData; // Pasa la firma al campo oculto
                if (!validateSelects()) {
                    return;
                }
                form.submit()
            });
        });
   


   
        function validateSelects() {
        const idsSelectWithValidation = ['apply', 'work', 'migration_status', 'socialSecurity', 'selectAgent']
        console.log(idsSelectWithValidation)
        let isValid = true;
        const phoneNumber = document.getElementById('phone_number')


        // Función para validar los Select
        for (let i = 0; i < idsSelectWithValidation.length; i++) {
            var idSelect = idsSelectWithValidation[i];
            console.log(idSelect)
            var select = document.getElementById(idSelect);
            console.log(select)
            if (select.value == 'no_valid') {
            isValid = false;
            select.focus(); // Hace foco en el select inválido
            break; // Detiene la iteración
            }
        }

        if (!isValid){
            return false;
        }
        return true;
        }
   

   
        const dropzone = document.getElementById("dropzone");
        const fileInput = document.getElementById("fileInput");
        const fileList = document.getElementById("fileList");
    
        // Lista para almacenar los archivos acumulados
        let uploadedFiles = [];
    
        // Hacer clic en el área de arrastre para abrir el selector de archivos
        dropzone.addEventListener("click", () => fileInput.click());
    
        // Manejar la carga de archivos con el selector
        fileInput.addEventListener("change", (event) => {
            const files = Array.from(event.target.files);
            handleFiles(files);
        });
    
        // Manejar el arrastre y suelta
        dropzone.addEventListener("dragover", (event) => {
            event.preventDefault();
            dropzone.style.borderColor = "#fc792f";
        });
    
        dropzone.addEventListener("dragleave", () => {
            dropzone.style.borderColor = "#ddd";
        });
    
        dropzone.addEventListener("drop", (event) => {
            event.preventDefault();
            dropzone.style.borderColor = "#ddd";
            const files = Array.from(event.dataTransfer.files);
            handleFiles(files);
        });
    
        // Función para manejar los archivos
        function handleFiles(files) {
            files.forEach((file) => {
                // Evitar duplicados
                if (!uploadedFiles.find((f) => f.name === file.name && f.size === file.size)) {
                    uploadedFiles.push(file);
                    addFileToList(file);
                }
            });
        }
    
        // Agregar archivo a la lista visual
        function addFileToList(file) {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
    
            const fileInfo = document.createElement("div");
            fileInfo.innerHTML = `
                <i class="bi bi-file-earmark"></i>
                <span>${file.name}</span>
            `;
    
            const fileSize = document.createElement("span");
            fileSize.className = "text-muted small";
            fileSize.textContent = `${(file.size / 1024).toFixed(1)}KB`;
    
            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-sm btn-outline-danger";
            deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
            deleteButton.onclick = () => {
                // Eliminar archivo de la lista
                uploadedFiles = uploadedFiles.filter((f) => f !== file);
                fileList.removeChild(listItem);
            };
    
            listItem.appendChild(fileInfo);
            listItem.appendChild(fileSize);
            listItem.appendChild(deleteButton);
            fileList.appendChild(listItem);
        }
   

   
        // Obtener elementos del DOM
        const inputName = document.getElementById('inputName');
        const inputLastName = document.getElementById('inputLastName');
        const selectAgent = document.getElementById('selectAgent');
        const selectCarrier = document.getElementById('selectCarrier');
        const insuranceAgency = document.getElementById('insuranceAgency');

        // Crear un array dinámicamente de los inputs
        const inputs = [inputName, inputLastName];

        // Agregar eventos de entrada a cada input
        inputs.forEach(input => {
            input.addEventListener('input', updateSpan);
        });

        // Actualizar el span con los valores de los inputs
        function updateSpan() {
            changeSpan('textName', `${inputName.value} ${inputLastName.value}`);
        }

        // Agregar evento al cambio del selectAgent
        selectAgent.addEventListener('change', function () {
            // Obtener el texto del option seleccionado en lugar del value
            const selectedText = selectAgent.options[selectAgent.selectedIndex].text;
            changeSpan('textAgent', selectedText);
            changeSpan('textAgent2', selectedText);

            updateCarrierByAgent(selectedText);
        });

        // Agregar evento al cambio del selectCarrier
        selectCarrier.addEventListener('change', function () {
            // Obtener el texto del option seleccionado en lugar del value
            const carrierText = selectCarrier.options[selectCarrier.selectedIndex].text;
            changeCarrierSpans(carrierText);
        });

        // Función para actualizar el contenido de un span
        function changeSpan(id, text) {
            const span = document.getElementById(id);
            if (span) {
                span.innerText = text;
            }
        }

        // Función para actualizar los spans relacionados al carrier
        function changeCarrierSpans(carrier) {
            changeSpan('textCarrier', carrier);
            changeSpan('textCarrier2', carrier);
            changeSpan('textCarrier3', carrier);
        }

        // Función para determinar y actualizar los spans del carrier según el agente
        function updateCarrierByAgent(agent) {
            if (agent.includes('GINA') || agent.includes('LUIS')) {
                changeCarrierSpans('TRUINSURANCE GROUP LLC');
                insuranceAgency.value = 'TRUINSURANCE GROUP LLC'
            } else if (
                agent.includes('DANIEL') ||
                agent.includes('ZOHIRA') ||
                agent.includes('DANIESKA') ||
                agent.includes('VLADIMIR') ||
                agent.includes('FRANK')
            ) {
                changeCarrierSpans('LAPEIRA & ASSOCIATES LLC');
                insuranceAgency.value = 'LAPEIRA & ASSOCIATES LLC'
            } else if (
                agent.includes('BORJA') ||
                agent.includes('RODRIGO') ||
                agent.includes('EVELYN')
            ) {
                changeCarrierSpans('SECUREPLUS INSURANCE LLC');
                insuranceAgency.value = 'SECUREPLUS INSURANCE LLC'
            } else {
                changeCarrierSpans(''); // Default value if no match
            }
        }
   
 
        
  