import { DropdownDomOptions, Payload, RootState } from '../models/types';
import DropdownListener from './DropdownListener';

class DropdownDomController {
  private dropdownListener: DropdownListener;
  private dropdown: HTMLElement;
  private setValueToInput: (value: string) => void;
  private onChangeStateSubscriber: Function;
  private openDropdown: Function;
  private closedDropdown: Function;
  constructor(options: DropdownDomOptions) {
    const { viewConnector, getEventNames, trigger, onChangeStateSubscriber } = options;
    const { dropdown, defaultItem, openDropdown, closedDropdown, setValueToInput } = viewConnector;
    this.dropdownListener = new DropdownListener(dropdown, defaultItem, getEventNames, trigger);
    this.dropdown = dropdown;
    this.setValueToInput = setValueToInput;
    this.onChangeStateSubscriber = onChangeStateSubscriber;
    this.openDropdown = openDropdown;
    this.closedDropdown = closedDropdown;
    dropdown.tabIndex = 0;
    dropdown.addEventListener('focusin', this.onFocus, true);
    dropdown.addEventListener('blur', this.onBlur);
    onChangeStateSubscriber(this.onChangeState);
  }

  private onChangeState = (state: RootState, payload: Payload): void => {
		const {title, init} = payload
		if (init === true) {
			const { title } = state;
			this.setValueToInput(title);
		}else {
			if (title !== undefined) {
				this.setValueToInput(title)
			}
		}
  };

  private onFocus = (e: MouseEvent): void => {
    const element: HTMLElement = e.target as HTMLElement;

    if (this.dropdown.contains(element)) {
      this.dropdown.focus();
    }
    this.openDropdown();
  };
  private onBlur = (e: MouseEvent): void => {
    const element: HTMLElement = e.relatedTarget as HTMLElement;
    if (this.dropdown.contains(element)) {
      this.dropdown.focus();
    } else {
      this.closedDropdown();
    }
  };
}

export default DropdownDomController;
