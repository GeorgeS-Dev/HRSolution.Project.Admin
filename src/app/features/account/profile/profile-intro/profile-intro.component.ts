import { Component, Inject, NgModule, Injector } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { jwtTokenClaims } from '../../../../core/services/identity/models/jwtTokenClaims';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TokenService } from '../../../../core/services/identity/services/token.service';
import { NgClass, NgIf } from '@angular/common';
import {
    MatDialog,
    MatDialogRef,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { IdentityService } from '../../../../core/services/identity/services/identity.service';
import { ApiError } from '../../../../core/services/api-response';
import { QRCodeModule  } from 'angularx-qrcode';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, NgModel, NgModelGroup } from '@angular/forms';

@Component({
    selector: 'app-profile-intro',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatTooltipModule, NgIf],
    templateUrl: './profile-intro.component.html',
    styleUrl: './profile-intro.component.scss'
})

export class ProfileIntroComponent {
userClaims: jwtTokenClaims;
TwoFAActive: boolean = false;

    constructor(
        private injector: Injector,
        public dialog: MatDialog
    ) {
        const tokenService = this.injector.get(TokenService);
        this.userClaims = tokenService.getDecodedToken();
    }

    openTwoFactorDialog(): void {
        this.dialog.open(TwoFactorWarnDialog, {
            width: '550px',
        });
    }

    openDisableTwoFactorDialog(): void {
        this.dialog.open(TwoFactorDisableDialog, {
            width: '550px',
        });
    }
}

@Component({
    selector: 'TwoFactorWarnDialog',
    templateUrl: './dialogs/twoFactorWarnDialog.html',
    standalone: true,
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
})
export class TwoFactorWarnDialog {

    constructor(
        public dialogRef: MatDialogRef<TwoFactorWarnDialog>,
        public dialog: MatDialog,
        private identityService: IdentityService
    ) {}
    confirm2FAActivation(): void {
        this.dialog.closeAll();
        this.identityService.twoFactorEnableSend().subscribe(
            (data) => {
                this.dialog.open(TwoFactorCodeDialog, {
                    width: '550px',
                    data: data
                });
            },
            (error: ApiError) => {
                // Show Unknown Error
            }
        );
    }
}

@Component({
    selector: 'TwoFactorCodeDialog',
    templateUrl: './dialogs/twoFactorCodeDialog.html',
    styleUrl: './profile-intro.component.scss',
    standalone: true,
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, QRCodeModule, MatFormFieldModule, FormsModule, NgClass, NgIf ],
})
export class TwoFactorCodeDialog {
twoFactorString: string = "";
verificationCode: string = '';
isCodeInvalid: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<TwoFactorCodeDialog>,
        public dialog: MatDialog,
        private identityService: IdentityService,
        @Inject(MAT_DIALOG_DATA) public data: string
    ) {
        this.twoFactorString = data;
    }
    confirm2FAActivation(): void {

    }
    validateCode() {
        this.identityService.twoFactorEnableConfirm(this.verificationCode).subscribe(
            () => {
                this.dialog.closeAll();
                this.dialog.open(TwoFactorCodeConfirmDialog, {
                    width: '550px'
                });
                // Refresh user token after this
            },
            (error: ApiError) => {
                this.isCodeInvalid = true;
            }
        );
      }
}

@Component({
    selector: 'TwoFactorCodeConfirmDialog',
    templateUrl: './dialogs/twoFactorCodeConfirmDialog.html',
    standalone: true,
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
})
export class TwoFactorCodeConfirmDialog {

    constructor(
        public dialogRef: MatDialogRef<TwoFactorCodeConfirmDialog>,
        public dialog: MatDialog,
        private identityService: IdentityService
    ) {}
}

@Component({
    selector: 'TwoFactorDisableDialog',
    templateUrl: './dialogs/twoFactorDisableDialog.html',
    standalone: true,
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, NgIf],
})
export class TwoFactorDisableDialog {
hasDisabled: boolean = false;
hasError: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<TwoFactorDisableDialog>,
        public dialog: MatDialog,
        private identityService: IdentityService
    ) {}

    DisableTwoFactor() : void {

        this.identityService.disableTwoFactor().subscribe(
            () => {
                this.hasDisabled = true;
            },
            (error: ApiError) => {
                this.hasError = true;
            }
        );
    }
}