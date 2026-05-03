import searchButtonIcon from "../assets/button_icons/search_icon_black.svg";
import "./SearchBar.css";
interface ISearchBarProps {
    handleSearchCallBackFunction: (val: string) => Promise<any | null>;
    handleSearchButtonOnClickCallBackFunction: () => void;
}
export default function SearchBar({
    handleSearchCallBackFunction,
    handleSearchButtonOnClickCallBackFunction,
}: ISearchBarProps) {
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSearchCallBackFunction(e.target.value);
    };
    return (
        <div className="search-bar-container">
            <label htmlFor="location-search" className="hide-visually"></label>
            <div className="search-bar">
                <input
                    type="search"
                    name="q"
                    id="location-search"
                    placeholder="Search for location"
                    onChange={handleOnChange}
                />
                <button type="submit" onClick={handleSearchButtonOnClickCallBackFunction}>
                    <img
                        className="search-button-svg-icon"
                        src={searchButtonIcon}
                        alt="search button"
                    />
                </button>
            </div>
        </div>
    );
}
