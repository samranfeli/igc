type Props = {
    width?: number;
    height?: number;
    className?: string;
}

const Location: React.FC<Props> = props => {
    return (
        <svg
            viewBox="0 0 500 500"
            className={props.className || "fill-current"}
            width={props.width || 24}
            height={props.height || 24}
        >
            <path d="M253.75,475.12c-43.19-71.7-85.86-139.63-125.59-209.24c-44.62-78.18-28.03-159.62,39.25-207.18    c51.54-36.43,122.69-35.82,174.57,1.49c52.84,38,75.63,100.81,54.37,162.63c-10.66,31.01-27.6,60.19-44.15,88.78    C320.88,365.72,287.79,418.81,253.75,475.12z M252.49,254.8c39.07,0.32,72.37-32.46,72.63-71.48c0.26-38.82-32.66-72.1-71.72-72.5    c-39.07-0.41-71.88,32.14-72.22,71.63C180.84,221.92,212.93,254.48,252.49,254.8z"/>
        </svg>
    )
}

export default Location;