import React from 'react'
import './factura.css'

const facturaform = () => {
    return (
     <div>
       <form class="form">
           <div class="flex">
              <p> Orden de compra</p>
              <h5>Datos del proveedor <h5/>
              <label> 
                 <input class="input" type="text" placeholder="" required=""/> 
                 <span>nombre o razon social</span>
              </label>

              <label>
                 <input class="input" type="text" placeholder="" required="">
                 <span>CUIT</span>
              </label>
           </div>  
            
           <label>
              <input class="input" type="email" placeholder="" required="">
              <span>dirección </span>
           </label> 
        
           <label>
              <input class="input" type="text" placeholder="" required="">
              <span>teléfono </span>
           </label>
           <label>
              <textarea class="input01" placeholder="" rows="3" required=""></textarea>
              <span>correo electronico</span>
           </label>
    
           <button href="#" class="fancy">
           <span class="top-key"></span>
           <span class="text">ingresar</span>
           <span class="bottom-key-1"></span>
           <span class="bottom-key-2"></span>
           </button>
       </form>
     </div>
 )
}
