import precipitationIcon from "../assets/icons_32/precipitation_32.png";
import "./PrecipitationCard.css";
interface IPrecipitationCardProps {
    weekday: string;
    data: {
        unit: string;
        precipitationChance: number;
    };
    theme: string;
}
export default function PrecipitationCard({ weekday, data, theme }: IPrecipitationCardProps) {
    return (
        <div className={`precipitation-card precipitation-card-{theme}`}>
            <h2>{weekday}</h2>
            <img className="precipitation-icon" src={precipitationIcon} alt="precipitation icon" />
            <p className="precipitation-text">{`${data.precipitationChance}${data.unit}`}</p>
        </div>
    );
}
