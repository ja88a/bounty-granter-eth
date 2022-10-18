
// Class-Validator package & doc: https://www.npmjs.com/package/class-validator

import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments, isEthereumAddress
} from "class-validator";


@ValidatorConstraint()
export class IsEthAddressArray implements ValidatorConstraintInterface {
    public async validate(addrData: string[], args: ValidationArguments) {
        return Array.isArray(addrData) && addrData.reduce((a, b) => a && isEthereumAddress(b), true);
    }
}
