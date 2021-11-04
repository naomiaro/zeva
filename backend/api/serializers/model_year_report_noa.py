from rest_framework.serializers import ModelSerializer, \
    SerializerMethodField, SlugRelatedField
from enumfields.drf import EnumField
from api.models.model_year_report import ModelYearReport
from api.models.model_year_report_history import ModelYearReportHistory
from api.models.model_year_report_statuses import ModelYearReportStatuses
from api.models.supplemental_report_history import SupplementalReportHistory
from api.models.supplemental_report import SupplementalReport
from api.models.user_profile import UserProfile
from api.serializers.user import MemberSerializer, UserSerializer


class ModelYearReportNoaSerializer(ModelSerializer):
    validation_status = SerializerMethodField()

    def get_validation_status(self, obj):
        if obj.validation_status in [
            ModelYearReportStatuses.ASSESSED,
        ]:
            return obj.get_validation_status_display()

    class Meta:
        model = ModelYearReportHistory
        fields = (
            'update_timestamp', 'validation_status', 'id',
        )


class SupplementalNOASerializer(ModelSerializer):
    status = SerializerMethodField()
    update_user = SerializerMethodField()
    is_reassessment = SerializerMethodField()
    display_superseded_text = SerializerMethodField()

    def get_status(self, obj):
        return obj.validation_status.value

    def get_update_user(self, obj):
        user = UserProfile.objects.filter(username=obj.update_user).first()
        if user is None:
            return obj.create_user
        return user.display_name

    def get_display_superseded_text(self, obj):
        if obj.validation_status == ModelYearReportStatuses.ASSESSED:
            model_year_report_id = SupplementalReport.objects.filter(
                id=obj.supplemental_report_id).values_list(
                'model_year_report_id', flat=True
                ).first()
            supplemental_report = SupplementalReport.objects.filter(
                supplemental_id=obj.supplemental_report_id, 
                model_year_report_id=model_year_report_id,
                status__in=[ModelYearReportStatuses.ASSESSED]
            ).first()

            if supplemental_report:
                return True
        return False


    def get_is_reassessment(self, obj):
        user = UserProfile.objects.filter(username=obj.create_user).first()
        if user is None:
            return False

        if user.is_government:
            return True
        
        return False


    class Meta:
        model = SupplementalReportHistory
        fields = (
            'update_timestamp', 'status', 'id', 'update_user', 'supplemental_report_id', 'display_superseded_text',
            'is_reassessment'
        )
