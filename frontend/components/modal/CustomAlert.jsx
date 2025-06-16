import Swal from 'sweetalert2';

export const CustomAlert = (iconType, title) => {
    Swal.fire({
        title: title,
        icon: iconType,
        confirmButtonText: 'OK',
        draggable: false
    })
}