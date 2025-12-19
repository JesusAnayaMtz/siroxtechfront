import Swal, { type SweetAlertIcon } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

// Configuration for Tailwind CSS classes to match the theme
const customClass = {
    popup: '!bg-popover border border-border text-foreground rounded-lg shadow-lg',
    title: 'text-foreground font-semibold text-xl',
    content: 'text-muted-foreground',
    confirmButton: 'bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium mx-2 transition-colors',
    cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-md font-medium mx-2 transition-colors border border-border',
    icon: 'text-foreground', // Basic icon color override if needed
}

export const showConfirm = async (
    title: string,
    text: string,
    confirmButtonText: string = 'Sí, continuar',
    icon: SweetAlertIcon = 'warning'
): Promise<boolean> => {
    const result = await MySwal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Cancelar',
        buttonsStyling: false,
        customClass,
        // Allow using theme variables by removing some default styles
        // background: 'transparent', // We set bg in customClass.popup
        backdrop: `rgba(0,0,0,0.5)`, // Standard backdrop
    })

    return result.isConfirmed
}

export const showAlert = async (
    title: string,
    text: string,
    icon: SweetAlertIcon = 'success'
) => {
    await MySwal.fire({
        title,
        text,
        icon,
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
            ...customClass,
            confirmButton: 'bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium w-full mt-4 transition-colors',
        },
        // background: 'transparent',
    })
}
